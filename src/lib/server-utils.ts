import {headers} from "next/headers";
import {slugify} from "@/lib/utils";
import db from "@/lib/db";
import {articleSchema,} from "@/lib/db/schemas";
import {eq, count as countFunction} from "drizzle-orm";
import {id} from "postcss-selector-parser";


export function getServerRequestPathname() {
    const path = headers().get("x-current-path")
    if (!path)
        throw new Error("x-current-path is not being set properly on the middleware. Please check!")
    return path
}

export async function slugifyArticle(title: string) {
    const slug = slugify(title)
    const [{count}] = await db
        .select({count: countFunction()})
        .from(articleSchema)
        .where(eq(articleSchema.slug, slug))
        .limit(1)
    if (count === 0)
        return slug
    return slug + `-${count}`
}

interface rateLimitOptions {
    attempts?: number,
    resetAfter?: number,
}

export function rateLimit<T extends (...args: any[]) => any>
(
    func: T,
    options: rateLimitOptions = {}
) {
    const ipDict: { [key: string]: { count: number, registeredAt: number } } = {}
    options.resetAfter = (options.resetAfter ?? 24) * 60 * 60 * 1000;

    return async (...args: Parameters<T>) => {
        const ip = headers().get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
        ipDict[ip] = ipDict[ip] || {
            count: 0,
            registeredAt: Date.now(),
        }
        const now = Date.now()
        if (ipDict[ip] && now - ipDict[ip].registeredAt > (options.resetAfter as number)) {
            ipDict[ip].registeredAt = now
            ipDict[ip].count = 0
        }
        if (ipDict[ip].count < (options.attempts ?? 5)) {
            const res = func.constructor.name === "AsyncFunction"
                ? await func(...args)
                : func(...args)
            if ((res.status && res.status < 300) || res) {
                ipDict[ip].count += 1
            }
            return res
        }
        // const estimatedTimeLeft = new Date((options.resetAfter as number) - Date.now() - ipDict[ip].registeredAt)
        // const formattedTimeLeft = [
        //     estimatedTimeLeft.getHours().toString().padStart(2, "0"),
        //     estimatedTimeLeft.getMinutes().toString().padStart(2, "0"),
        //     estimatedTimeLeft.getSeconds().toString().padStart(2, "0"),
        // ].join(":")
        const elapsedTime = now - ipDict[ip].registeredAt; // Time since first attempt
        const remainingTime = Math.max(0, (options.resetAfter as number) - elapsedTime); // Ensure non-negative

        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        const formattedTimeLeft = [hours, minutes, seconds].join(":")

        const res = {
            status: 429,
            error: {
                message: `Maximum attempts exceeded. Please try again in ${formattedTimeLeft} (hours).`,
                detail: `IP address "${ip}" has exceeded requests on this URL.`,
            }
        }

        return res.status ? Response.json(res) : res
    }
}