import ForgotPasswordProvider from "@/app/auth/forgot-password/_components/context";

export default async function Layout({children}: { children: React.ReactNode }) {
    return (
        <ForgotPasswordProvider>
            {children}
        </ForgotPasswordProvider>
    )
}