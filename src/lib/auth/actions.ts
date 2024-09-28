"use server";

import { eq } from "drizzle-orm";
import db from "../db";
import { userSchema } from "../db/schemas";
import argon from "argon2"
import { cookies } from "next/headers";
import { encrypt } from "./jwt";

export async function signIn(username: string, password: string) {
    const user = await db.query.userSchema.findFirst({
        where: eq(userSchema.username, username),
    })

    if (user) {
        const passwordMatch = await argon.verify(user.password, password)
        if (passwordMatch) {
            const jwt = await encrypt({ username: user.username })
            cookies().set("auth_token", jwt)
            return {
                status: 200,
                message: "Authenticated successfully!"
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
        const token = await encrypt({ username: user.username })
        cookies().set("auth_token", token)
        return {
            status: 200,
            message: `Account "${username}" has been created`
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