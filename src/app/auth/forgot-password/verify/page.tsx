"use client";

import {verifyForgotPasswordToken} from "@/lib/auth/actions";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter()
    const encodedToken = searchParams.get("token")
    const [verifying, setVerifying] = useState(true);
    const [userMsg, setUserMsg] = useState<{ title: string, description: string } | null>(null);
    useEffect(() => {
        (async () => {
            if (encodedToken) {
                const decodedToken = decodeURIComponent(encodedToken)
                const isValidRes = await verifyForgotPasswordToken(decodedToken)
                setVerifying(false)
                if (isValidRes.error) {
                    setUserMsg({
                        title: isValidRes.status >= 400 && isValidRes.status < 500 ? "Invalid Token" : "Server Error",
                        description: isValidRes.status >= 400 && isValidRes.status < 500 ? "The token you provided either has expired or didn't exist" : "We couldn't verify your token. Try again later",
                    })
                }
                setUserMsg({
                    title: "Token is correct!",
                    description: "Wait until we redirect you to reset your password",
                })
                setTimeout(() => router.push("/auth/forgot-password/reset"), 1000)
            }

        })()
    }, []);

    if (!encodedToken) {
        return (
            <div className={""}>
                No token has been supplied. Please check your email and click on the verification link.
            </div>
        )
    }

    const tokenProvidedView = (
        <>
            {verifying || !userMsg && (
                <div className={"flex flex-col gap-y-2"}>
                    Wait. We are verifying your token
                    <div className={"animate-spin border-2 border-t-0 h-1 w-1  rounded-full"}></div>
                </div>
            )}
            {
                !verifying && userMsg && (
                    <div className={""}>
                        {userMsg.title}
                        <p>{userMsg.description}</p>
                    </div>
                )
            }
        </>
    )
    return (
        <div
            className={"flex flex-col items-center text-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}>
            <h1 className={"text-5xl"}>Forgot Password</h1>
            <div>
                {tokenProvidedView}
            </div>
        </div>

    )
}