"use client";

import {forgotPassword} from "@/lib/auth/actions";
import {useEffect, useState} from "react";
import { useRouter} from "next/navigation";

export default function Page({searchParams}) {
    const router = useRouter()
    const token = decodeURIComponent(searchParams.get("token"));
    const [verifying, setVerifying] = useState(true);
    const [userMsg, setUserMsg] = useState<{ title: string, description: string } | null>(null);
    useEffect(() => {
        (async () => {
            const isValidRes = await forgotPassword(token)
            setVerifying(false)
            if (isValidRes.error) {
                setUserMsg({
                    title: isValidRes.status >= 400 && isValidRes.status < 500 ? "Invalid Token" : "Server Error",
                    description: isValidRes.status >= 400 && isValidRes.status < 500 ? "The token you provided either has expired or didn't exist" : "We couldn't process your token. Try again later",
                })
            }
            setUserMsg({
                title: "Token is correct!",
                description: "Wait until we redirect you to reset your password",
            })
            setTimeout(() => router.push("/"), 1000)

        })()
    }, []);

    return (
        <div
            className={"flex text-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}>
            <h1 className={"text-5xl"}>Forgot Password</h1>
            <div>
                {verifying && (
                    <div className={""}>
                        Wait. We are verifying your token
                        <span className={"animate-spin border-2 border-t-0 h-1 w-1 rounded-full"}></span></div>
                )}
                {!verifying && userMsg && (
                    <div className={""}>
                        {userMsg.title}
                        <p>{userMsg.description}</p>
                    </div>
                )}
            </div>
        </div>

    )
}