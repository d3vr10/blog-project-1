"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {verifyForgotPasswordToken} from "@/actions/auth";
import clsx from "clsx";

export default function VerifyTokenContainer({encodedToken}: { encodedToken: string }) {
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);
    const [userMsg, setUserMsg] = useState<{ title: string; description: string; variant?: string } | null>(null);

    useEffect(() => {
        (async () => {
            const decodedToken = decodeURIComponent(encodedToken);
            const isValidRes = await verifyForgotPasswordToken(decodedToken);
            setVerifying(false);
            if (isValidRes.error) {
                setUserMsg({
                    variant: "destructive",
                    title: isValidRes.status >= 400 && isValidRes.status < 500 ? "Invalid Token" : "Server Error",
                    description: isValidRes.status >= 400 && isValidRes.status < 500 ?
                        "The token you provided either has expired or didn't exist" :
                        "We couldn't verify your token. Try again later",
                });
            } else {
                setUserMsg({
                    title: "Token is correct!",
                    description: "Wait until we redirect you to reset your password",
                });
                setTimeout(() => router.push("/auth/forgot-password/reset"), 1000);
            }
        })();
    }, []);


    return (
        <div
            className={"flex flex-col items-center text-center justify-center"}>
            <h1 className={"text-4xl"}>Token Verification</h1>
            {verifying || !userMsg ? (
                <div className={"flex flex-col gap-y-2"}>
                    Wait. We are verifying your token
                    <div className={"animate-spin border-2 border-t-0 h-1 w-1 rounded-full"}></div>
                </div>
            ) : (
                <div className={""}>
                    <h3 className={clsx({
                        "text-destructive font-extrabold": userMsg.variant === "destructive",
                    })}>{userMsg.title}</h3>
                    <p className={clsx({
                        "text-destructive": userMsg.variant === "destructive",
                    })}>{userMsg.description}</p>
                </div>
            )
            }
        </div>
    );
}
