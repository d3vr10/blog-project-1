"use server";

import {revalidatePath} from "next/cache";

export async function revalidatePathAction(path: string, type?: "page" | "layout"): Promise<void> {
    revalidatePath(path, type)

}