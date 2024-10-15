import db from "@/lib/db";
import {articleSchema, userSchema} from "@/lib/db/schemas";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";
import article from "@/lib/db/schemas/article";
import Image from "next/image"
import ClientDate from "@/app/articles/_components/client-date";
import {Badge} from "@/components/ui/badge";

export default async function Page({params: {slug}}: { params: { slug: string } }) {
    const [joinedResult] = await db.select()
        .from(articleSchema)
        .innerJoin(userSchema, eq(userSchema.id, articleSchema.userId))
        .where(eq(articleSchema.slug, slug))

    if (!joinedResult) {
        notFound()
    }
    let key = joinedResult.article.featuredImage ? joinedResult.article.featuredImage
            .replace("^/+", "")
            .replace("/+$", "")
        : undefined //coercing to aws-like key format
    return (

        <div className={"container mx-auto"}>
            <article className={"flex flex-col gap-y-6"}>
                <div className={"flex flex-col gap-y-6"}>
                    <h1 className={"text-5xl font-bold tracking-tight leading-none"}>{joinedResult.article.title}</h1>
                    <div className={"flex justify-between"}>
                        <span className={"inline-flex items-center gap-x-2"}>Written by: <Badge
                            className={"bg-green-500"}>{joinedResult.user.username}</Badge></span>
                        <span><ClientDate/></span>
                    </div>
                </div>
                <div className={"xl:w-4/5 "}>
                    <div className={"border-2 aspect-video mb-6 w-full h-auto"}>
                        {key ?
                            <Image src={"/api/articles/featured-image/" + encodeURIComponent(key)}
                                   width={1280}
                                   height={720} alt={"Article's portrait"}
                                   className={"max-w-full h-auto aspect-video block object-cover"}/> : ""}
                    </div>
                    <blockquote
                        className={"border-l-2 border-muted text-muted italic pl-2 py-2  mx-auto mb-6"}>
                        {joinedResult.article.excerpt}
                    </blockquote>
                    <div className={"text-md"}>
                        {joinedResult.article.content}
                    </div>
                </div>
            </article>
        </div>
    )
}

export async function generateStaticParams() {
    const articles = await db.query.articleSchema.findMany()
    return articles.map((article) => ({
        slug: article.slug,
    }))
}
