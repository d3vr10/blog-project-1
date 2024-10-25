import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import SignUpFormContainer from "@/components/forms/auth/SignUpFormContainer";

export default async function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Fill in with just the essentials. It won't take long!</CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpFormContainer />
            </CardContent>
        </Card>
    )
}