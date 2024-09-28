import { createSchema } from "@/components/article/create-form";
import db from "../db";
import { articleSchema } from "../db/schemas";
import { slugify } from "../utils";

export async function createArticle(values: {
    title: string,
    content: string,
    excerpt: string,
    featuredImageURL?: string,
}) {
    try {
        const { title, content, excerpt, featuredImageURL } = createSchema.parse(values)
        await db.insert(articleSchema).values({
            title,
            content,
            excerpt,
            featuredImageURL,
            slug: slugify(title),
        })
    } catch (err) {
        throw err
    }
}