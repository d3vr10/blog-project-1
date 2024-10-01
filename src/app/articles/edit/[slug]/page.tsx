import EditForm from "@/components/article/edit-form";
import {articleSchema} from "@/lib/db/schemas";
import {eq} from "drizzle-orm";
import db from "@/lib/db";
import {notFound} from "next/navigation";

export default async function Page({ params: { slug}}: { params: {slug: string} }) {
    const article = await db.query.articleSchema.findFirst({
        where: eq(articleSchema.slug, slug)
    })
    if (!article) {
        notFound()
    }
    return (
        <EditForm title={article.title} content={article.content} excerpt={article.excerpt} slug={slug}/>
    )

}