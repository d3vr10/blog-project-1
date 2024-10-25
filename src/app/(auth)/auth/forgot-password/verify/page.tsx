import VerifyTokenContainer from "@/components/forms/auth/VerifyTokenContainer";

export default function Page({searchParams}: { searchParams: { token: string}}) {
    const encodedToken = searchParams["token"]
    return (
        <>
            {!encodedToken && (
                <div>
                    No token has been supplied. Please check your email and click on the verification link.
                </div>
            )}
            {encodedToken && <VerifyTokenContainer encodedToken={encodedToken}/>}
        </>
    )
}