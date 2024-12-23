import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import CreateContainer from "@/components/forms/articles/CreateContainer";

export default async function Page() {
    return (
        <div className="container mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Create an article</CardTitle>
                    <CardDescription>SDSAdaddsad</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateContainer />
                </CardContent>
            </Card>
        </div>
    )
}