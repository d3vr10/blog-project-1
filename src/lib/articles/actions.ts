"use server";


import { eq } from "drizzle-orm";
import db from "../db";
import { articleSchema } from "../db/schemas";
import { createSchema } from "../schemas/article";
import { slugify } from "../utils";
import {notFound} from "next/navigation";

export async function createArticle(values: {
    title: string,
    content: string,
    excerpt: string,
    featuredImage?: FileList,
    userId: string,
}) {
    try {
        const { title, content, excerpt, featuredImage } = createSchema.parse(values)
        await db.insert(articleSchema).values({
            title,
            content,
            excerpt,
            featuredImage: featuredImage[0],
            slug: slugify(title),
            userId: values.userId,
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


export async function deleteArticle(slug: string) {
    try {
        const articles = await db.delete(articleSchema).where(eq(articleSchema.slug, slug)).returning()
        if (articles.length > 0) {
            return {
                status: 200,
                message: `Article "${slug}" was deleted`
            }
        } else return {
            status: 404,
            error: {
                message: `Article ${slug} does not exist!`

            }
        }
    } catch (err: any) {
        return {
            status: 500,
            error: {
                message: "There was an error while attempting to delete from the database."
            }
        }
    }

}

export async function editArticle(values: { title: string, content: string, excerpt: string, featuredImage?: string, slug: string }) {
    const { title, content, excerpt, featuredImage } = createSchema.parse(values)
    try {
        const article = await db.update(articleSchema)
            .set({title: title, content: content, excerpt: excerpt, featuredImage: featuredImage})
            .where(eq(articleSchema.slug, values.slug))
            .returning()
        if (!article) {
            return {
                status: 404,
                error: {
                    message: "Not found article"
                },
            }
        }
        return {
            status: 200,
            message: "Updated article"
        }
    } catch(err: any){
        return {
            status: 500,
            error: {
                message: "Unknown error"
            }
        }
    }
}