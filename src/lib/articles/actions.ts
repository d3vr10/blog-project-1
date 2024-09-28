"use server";


import db from "../db";
import { articleSchema } from "../db/schemas";
import { createSchema } from "../schemas/article";
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
        return {
            status: 201,
            message: "Article created"
        }
    } catch (err: any) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return {
                status: 409,
                error: {
                    message: "An article with this title already exists",
                }
            }
        }
        return {
            status: 500,
            error: {
                message: "Unknown error"
            }
        }
    }
}