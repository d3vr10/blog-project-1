import VerifyToken from "@/app/(auth)/auth/forgot-password/verify/_components/verify-token";

export default function Page({searchParams}) {
    const encodedToken = searchParams["token"]
    return (
        <>
            {!encodedToken && (
                <div>
                    No token has been supplied. Please check your email and click on the verification link.
                </div>
            )}
            {encodedToken && <VerifyToken encodedToken={encodedToken}/>}
        </>
    )
}