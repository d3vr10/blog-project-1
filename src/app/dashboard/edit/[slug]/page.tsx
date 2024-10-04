import EditForm from "@/components/article/edit-form";
import {articleSchema} from "@/lib/db/schemas";
import {eq} from "drizzle-orm";
import db from "@/lib/db";
import {notFound} from "next/navigation";
import fs from "fs"

export default async function Page({ params: { slug}}: { params: {slug: string} }) {
    const article = await db.query.articleSchema.findFirst({
        where: eq(articleSchema.slug, slug)
    })
    if (!article) {
        notFound()
    }
    let file;
    if (article.featuredImage) {
        file = {
            name: article.featuredImage.split("/").slice(-1, -1)[0],
            base64Contents: Buffer.from(fs.readFileSync(article.featuredImage)).toString("base64"),
        }
    }

    return (
        <EditForm title={article.title} content={article.content} excerpt={article.excerpt} featuredImage={file} slug={slug}/>
    )

}