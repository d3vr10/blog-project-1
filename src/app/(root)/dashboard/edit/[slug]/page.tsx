import {articleSchema} from "@/lib/db/schemas";
import {eq} from "drizzle-orm";
import db from "@/lib/db";
import {notFound} from "next/navigation";
import {retrieveFileContents} from "@/lib/fs/file-storage";
import path from "path"
import EditContainer from "@/components/forms/articles/EditContainer";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const {slug} = await props.params;
    const article = await db.query.articleSchema.findFirst({
        where: eq(articleSchema.slug, slug)
    })
    if (!article) {
        notFound()
    }
    let imageFile = undefined;
    if (article.featuredImage) {
        const buffer = await retrieveFileContents(article.featuredImage)
        imageFile = {
            name: path.basename(article.featuredImage),
            base64Contents: Buffer.from(buffer).toString("base64")
        }

    }

    return (
        <EditContainer
            title={article.title}
            content={article.content}
            excerpt={article.excerpt}
            featuredImage={imageFile}
            slug={slug}
        />
    )

}