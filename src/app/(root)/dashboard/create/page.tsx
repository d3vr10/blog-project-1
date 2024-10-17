import CreateForm from "@/app/(root)/articles/_components/create-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page() {
    return (
        <div className="container mx-auto">
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Create an article</CardTitle>
                    <CardDescription>SDSAdaddsad</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateForm />
                </CardContent>
            </Card>
        </div>
    )
}