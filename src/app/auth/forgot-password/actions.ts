"use server";

import db from "@/lib/db";
import {forgotPasswordSchema, userSchema} from "@/lib/db/schemas";
import {eq} from "drizzle-orm";
import {randomBytes} from "node:crypto";
import {sendForgotPasswordEmail} from "@/lib/auth/mailer";
import {cookies} from "next/headers";
import argon from "argon2";

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

export default async function resetPassword(password: string) {
    const token = cookies().get("forgot-password-token")?.value
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
    cookies().delete("forgot-password-token")
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