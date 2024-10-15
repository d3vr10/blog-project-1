import {headers} from "next/headers";
import {slugify} from "@/lib/utils";
import db from "@/lib/db";
import {articleSchema,} from "@/lib/db/schemas";
import {eq, count as countFunction} from "drizzle-orm";


export function getServerRequestPathname() {
    const path = headers().get("x-current-path")
    if (!path)
        throw new Error("x-current-path is not being set properly on the middleware. Please check!")
    return path
}
export async function slugifyArticle(title: string) {
    const slug = slugify(title)
    const [{count}] = await db
        .select({ count: countFunction()})
        .from(articleSchema)
        .where(eq(articleSchema.slug, slug))
        .limit(1)
    if (count === 0)
        return slug
    return slug+`-${count}`
}
