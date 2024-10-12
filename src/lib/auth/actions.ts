"use server";

import { eq } from "drizzle-orm";
import db from "../db";
import {forgotPasswordSchema, userSchema} from "../db/schemas";
import argon from "argon2"
import { cookies } from "next/headers";
import { encrypt, verify } from "./jwt";

export async function signIn(username: string, password: string) {
    const user = await db.query.userSchema.findFirst({
        where: eq(userSchema.username, username),
    })

    if (user) {
        const passwordMatch = await argon.verify(user.password, password)
        if (passwordMatch) {
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username
            }
            const jwt = await encrypt(payload)
            cookies().set("auth_token", jwt)
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
        cookies().set("auth_token", token)
        return {
            status: 200,
            message: `Account "${username}" has been created`,
            payload: payload
        }
    } catch (err: any) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            const match = /\.(?<column>[A-Z0-9]+)/i.exec(err.message)
            if (match) {
                const { column }: { column: string } = match.groups as Exclude<undefined, typeof match.groups>
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
    const cookie = cookies().get("auth_token")
    if (cookie) {
        const { value } = cookie
        try {
            const jwtPayload = await verify(value)
            const payload = { id: jwtPayload.id as string, username: jwtPayload.username as string, email: jwtPayload.email as string }
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

export async function forgotPassword(encodedToken: string) {
    const token = decodeURIComponent(encodedToken)
    const {id}: any = await verify(token)
    const userForgotToken = await db.query.forgotPasswordSchema.findFirst({
        where: eq(forgotPasswordSchema.userId, id)
    })
    if (!userForgotToken) {

        return {
            status: 404,
            error: {
                message: "Token doesn't exist"
            }
        }
    }

    const row = await db.delete(forgotPasswordSchema).where(eq(forgotPasswordSchema.userId, id))
    return {
        status: 200,
        message: "Token is valid!"
    }
}

export async function logout() {
    cookies().delete("auth_token")
}