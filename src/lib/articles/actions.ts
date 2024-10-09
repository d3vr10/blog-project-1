"use server";


import { eq } from "drizzle-orm";
import db from "../db";
import { articleSchema } from "../db/schemas";
import {createSchemaServer, editSchemaServer} from "../schemas/article";
import { slugify } from "../utils";
import {removeFileContents, retrieveFileContents, storeFile} from "@/lib/fs/file-storage";
import {verify} from "@/lib/auth/jwt";
import {cookies} from "next/headers";

export async function createArticle(values: {
    title: string,
    content: string,
    excerpt: string,
    featuredImage?: FormData,
    userId: string,
}) {
    try {
        const { title, content, excerpt, featuredImage } = createSchemaServer.parse(values)
        let path = undefined
        if (featuredImage) {
            const tokenCookie = cookies().get("auth_token")
            if (tokenCookie) {
                const payload = await verify(tokenCookie.value)
                path = await storeFile({ title, username: payload.username as string, file: featuredImage})
            } else {
                return {
                    status: 403,
                    error: {
                        message: "Not authorized",
                    }
                }
            }
        }
        await db.insert(articleSchema).values({
            title,
            content,
            excerpt,
            featuredImage: path,
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

export async function editArticle(values: { title: string, content: string, excerpt: string, featuredImage?: FormData | null | undefined, slug: string }) {
    const { title, content, excerpt, featuredImage } = editSchemaServer.parse(values)
    try {
        const oldArticle = await db.query.articleSchema.findFirst({
            columns: {
                id: true,
                slug: true,
                featuredImage: true,
            },
            where: eq(articleSchema.slug, values.slug)
        })
        if (!oldArticle) {
            return {
                status: 404,
                error: {
                    message: "Article not found!"
                }
            }
        }
        let path = undefined
        if (featuredImage) {
            path = await storeFile(featuredImage)
            if (oldArticle.featuredImage) {
                removeFileContents(oldArticle.featuredImage)
            }
        } else if (featuredImage === null && oldArticle.featuredImage) {
            path = null
            await removeFileContents(oldArticle.featuredImage)
        }
        const article = await db.update(articleSchema)
            .set({title: title, content: content, excerpt: excerpt, featuredImage: path, slug: slugify(title)})
            .where(eq(articleSchema.slug, values.slug))
            .returning()
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


export async function retrieveFeaturedImage(slug: string) {
    const article = await db.query.articleSchema.findFirst({
        where: eq(articleSchema.slug, slug),
        columns: {
            featuredImage: true,
        }
    })

    if (article?.featuredImage) {
        const formData = new FormData()
        try {
            const data = retrieveFileContents(article.featuredImage)
            formData.set("file", new Blob([data]))
            return formData
        } catch (err: any) {
            return {
                status: 500,
                error: {
                    message: "File doesn't exist or there is insufficient permissions to read it"
                }
            }
        }
    }

    return {
        status: 404,
        error: {
            message: "Image was not found"
        }
    }

}