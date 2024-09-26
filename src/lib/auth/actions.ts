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

export async function signUp(username: string, password: string) {
    const hash = await argon.hash(password)
    try {
        const user = await db.insert(userSchema).values({
            username: username,
            password: hash,
        })
        return {
            status: 200,
            message: `Account "${username}" has been created`
        }
    } catch (err) {
        return {
            status: 400,
            error: {
                message: `User "${username}" already exists`
            }
        }
    }

}