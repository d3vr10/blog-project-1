"use server";

import {revalidatePath as nextRevalidatePath} from "next/cache";

const articleRoutes: Set<[string, "page" | "layout" | undefined]> = new Set([
    ["/dashboard", "page"],
    ["/", "page"],
])

export async function refreshArticles() {
    for (const [route, type] of articleRoutes) {
        console.log(`Refreshing route => "${route}" of type "${type}"`)
        nextRevalidatePath(route, type)
    }
}

export async function revalidatePath(route: string, type?: "page" | "layout") {
    nextRevalidatePath(route, type)
}