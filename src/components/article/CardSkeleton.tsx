import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import React from "react"

const ArticleCardSkeleton = React.forwardRef<HTMLDivElement, {
    className?: string,
}>(({className}, ref) => (
    <Card ref={ref} className={cn(className)}>
        <CardHeader>
            <Skeleton className={"aspect-video"}/>
        </CardHeader>
        <CardContent className={"flex flex-col gap-y-2"}>
            <div><Skeleton className={"w-2/3 h-4"}/></div>
            <div><Skeleton className={"w-full h-10"}/></div>
        </CardContent>
    </Card>
));
export default ArticleCardSkeleton;