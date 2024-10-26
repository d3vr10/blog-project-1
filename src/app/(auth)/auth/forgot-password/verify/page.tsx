import VerifyTokenContainer from "@/components/forms/auth/VerifyTokenContainer";

export default async function Page(props: { searchParams: Promise<{ token: string}>}) {
    const { token: encodedToken } = await props.searchParams
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