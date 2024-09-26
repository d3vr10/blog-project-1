import { SignJWT, jwtVerify } from "jose";
import env from "../env";

export async function encrypt(payload: { username: string }) {
    const encodedSecret = new TextEncoder().encode(env.JWT_SECRET)
    const jwt = await new SignJWT()
        .setExpirationTime(new Date(Date.now() + 1000 * 60 * 60 * 2))
        .setProtectedHeader({ alg: env.JWT_ALGO })
        .setIssuedAt()
        .setSubject(payload.username)
        .sign(encodedSecret)
    return jwt
}

export async function verify(jwtToken: string) {
    const encodedSecret = new TextEncoder().encode(env.JWT_SECRET)
    const { payload, protectedHeader } = await jwtVerify(jwtToken, encodedSecret)
    return payload
}