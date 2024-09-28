import SignupForm from "@/components/auth/signup-form";
import { Card, CardHeader, CardTitle,CardDescription, CardContent } from "@/components/ui/card";

export default async function Page() {
    return (
        <div className="max-w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Card >
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>Fill in with just the essentials. It won't take long!</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    )
}