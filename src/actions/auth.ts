"use server";

import {eq} from "drizzle-orm";
import db from "../lib/db";
import {forgotPasswordSchema, userSchema} from "../lib/db/schemas";
import argon from "argon2"
import {cookies as nextCookies} from "next/headers";
import {encrypt, verify} from "../lib/auth/jwt";
import {randomBytes} from "node:crypto";
import {sendForgotPasswordEmail} from "@/lib/auth/mailer";

export async function signIn({signInMethod, signInValue}: {
    signInMethod: "username" | "email",
    signInValue: string
}, password: string) {
    const user = await db.query.userSchema.findFirst({
        where: signInMethod === "username"? eq(userSchema.username, signInValue) : eq(userSchema.email, signInValue),
    })
    const cookies = await nextCookies()
    if (user) {
        const passwordMatch = await argon.verify(user.password, password)
        if (passwordMatch) {
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username
            }
            const jwt = await encrypt(payload)
            cookies.set("auth_token", jwt)
            return {
                status: 200,
                message: "Authenticated successfully!",
                payload: payload
            }
        }

    }

    return {
        status: 401,
        error: {
            message: "Wrong credentials",
        }
    }
}

export async function signUp({
                                 email,
                                 username,
                                 password,
                             }: {
    email: string,
    username: string,
    password: string,
}) {
    const hash = await argon.hash(password)
    const cookies = await nextCookies()
    try {
        const [user] = await db.insert(userSchema).values({
            email: email,
            username: username,
            password: hash,
        }).returning()
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username
        }
        const token = await encrypt(payload)
        cookies.set("auth_token", token)
        return {
            status: 200,
            message: `Account "${username}" has been created`,
            payload: payload
        }
    } catch (err: any) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            const match = /\.(?<column>[A-Z0-9]+)/i.exec(err.message)
            if (match) {
                const {column}: { column: string } = match.groups as Exclude<undefined, typeof match.groups>
                return {
                    status: 409,
                    error: {
                        message: `${column[0].toUpperCase() + column.substring(1)} already exists`
                    }
                }
            }
            return {
                status: 409,
                error: {
                    message: "Data already exists"
                }
            }
        }

        return {
            status: 500,
            error: {
                message: "Unknown Server Error"
            }
        }
    }

}

export async function validateSession() {
    const cookies = await nextCookies()
    const cookie = cookies.get("auth_token")
    if (cookie) {
        const {value} = cookie
        try {
            const jwtPayload = await verify(value)
            const payload = {
                id: jwtPayload.id as string,
                username: jwtPayload.username as string,
                email: jwtPayload.email as string
            }
            return {
                status: 200,
                payload: payload,
                message: "Session has been extended by 2 hours",
            }
        } catch (err: any) {
            return {
                status: 401,
                error: {
                    message: "Session is invalid!",
                }
            }
        }
    }
    return {
        status: 404,
        error: {
            message: "Session does not exist",
        }
    }
}

export async function verifyForgotPasswordToken(encodedToken: string) {
    const token = decodeURIComponent(encodedToken)
    const row = await db.query.forgotPasswordSchema.findFirst({
        where: eq(forgotPasswordSchema.token, token)
    })
    const cookies = await nextCookies()

    if (!row) {
        return {
            status: 404,
            error: {
                message: "Invalid Token",
                detail: "Token doesn't exist",
            }
        }
    }
    if (Date.now() >= row.expiresIn.getTime()) {
        return {
            status: 400,
            error: {
                message: "Expired Token",
                detail: "Token is behind current time"
            }
        }
    }

    cookies.set("forgot-password-token", row.token, {
        expires: row.expiresIn,
        httpOnly: true,
    })
    return {
        status: 200,
        message: "Token is valid!"
    }
}

export async function logout() {
    const cookies = await nextCookies()
    cookies.delete("auth_token")
}

export default async function resetPassword(password: string) {
    const cookies = await nextCookies()
    const token = cookies.get("forgot-password-token")?.value
    if (!token) {
        return {
            status: 429,
            error: {
                message: "Invalid token",
                detail: "Token is missing",
            }
        }
    }
    const row = await db.query.forgotPasswordSchema.findFirst({
        where: eq(forgotPasswordSchema.token, token)
    })
    if (!row) {
        return {
            status: 404,
            error: {
                message: "Invalid token",
                detail: "Token doesn't exist in the system",
            }
        }
    }

    const hash = await argon.hash(password)
    const [insertedRow] = await db
        .update(userSchema)
        .set({password: hash})
        .where(eq(userSchema.id, row.userId))
        .returning()
    if (!insertedRow) {
        return {
            status: 500,
            error: {
                message: "Server Error",
                detail: "Couldn't reset the password right now.",
            }
        }
    }

    //CLEANING
    cookies.delete("forgot-password-token")
    const [deletedRow] = await db
        .delete(forgotPasswordSchema)
        .where(eq(forgotPasswordSchema.token, token))
        .returning()
    if (!deletedRow) {

    }
    return {
        status: 200,
        message: "Password has been reset"
    }


}

export async function generateForgotPasswordToken(
    {resetValue, resetMethod}: {
        resetValue: string,
        resetMethod: "username" | "email"
    },
    display: "email" | "terminal" = "email",
) {
    const [row] = await db.select().from(userSchema).where(
        resetMethod === "email" ? eq(userSchema.email, resetValue) : eq(userSchema.username, resetValue)
    ).leftJoin(
        forgotPasswordSchema, eq(userSchema.id, forgotPasswordSchema.userId)
    )
    if (!row) {
        return {
            status: 404,
            error: {
                message: `Account with this ${resetMethod} "${resetValue}" doesn't exist`
            }
        }
    }
    if (row.forgot_password) {
        const deletedRow = await db.delete(forgotPasswordSchema).where(eq(forgotPasswordSchema.userId, row.user.id)).returning()
        if (!deletedRow) {
            return {
                status: 500,
                error: {
                    message: "There was an error while operating the deletion of an already existing reset password token"
                }
            }
        }
    }
    const [insertedRow] = await db.insert(forgotPasswordSchema).values({
        userId: row.user.id,
        token: randomBytes(128).toString("hex")
    }).returning()
    if (!insertedRow) {
        return {
            status: 200,
            error: {
                message: "There was an error while creating the new reset password token"
            }
        }
    }
    if (display === "email")
        await sendForgotPasswordEmail(row.user.username, row.user.email, insertedRow.token)
    else if (display === "terminal")
        console.log(`Generated forgot password token for email: "${row.user.email}"`)
    return {
        status: 200,
        message: "Reset password token was generated. Check email",
    }
}