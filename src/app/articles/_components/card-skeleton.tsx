import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {forwardRef} from "react";
const ArticleCardSkeleton = forwardRef(({ className }, ref) => (
    <Card ref={ref} className={cn(className)}>
        <CardHeader>
            <Skeleton className={"aspect-video"} />
        </CardHeader>
        <CardContent>
            <div>
                <CardTitle><Skeleton className={"w-2/3 h-4"} /></CardTitle>
            </div>
            <CardDescription><Skeleton className={"w-full h-10"} /></CardDescription>
        </CardContent>
        <CardFooter className={""}><Skeleton className={"w-1/3 h-3"} /></CardFooter>
    </Card>
));
export default ArticleCardSkeleton;