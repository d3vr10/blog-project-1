"use server";

import {cookies} from "next/headers";
import {verify} from "@/lib/auth/jwt";

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
