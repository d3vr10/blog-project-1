"use server";

import {revalidatePath} from "next/cache";

const articleRoutes: Set<[string, "page" | "layout" | undefined]> = new Set([
    ["/dashboard", "page"],
    ["/", "page"],
])
export async function refreshArticles() {

    for (const [route, type] of articleRoutes) {
        revalidatePath(route, type)
    }
}