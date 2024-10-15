import SignupForm from "@/app/(auth)/auth/_components/signup-form";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";

export default async function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Fill in with just the essentials. It won't take long!</CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm/>
            </CardContent>
        </Card>
    )
}