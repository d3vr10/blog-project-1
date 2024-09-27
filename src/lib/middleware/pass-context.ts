import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

function normalizeRawKey(headerName: string) {
    headerName = headerName.toLowerCase().trim()
    if (headerName.slice(0, 4) !== "ctx-")
        headerName = "ctx-" + headerName
    return headerName

}

function getAPIContext(req: NextRequest, rawKey: string) { 
    return req.headers.get(normalizeRawKey(rawKey))
}

function getPageContext(rawKey: string) {
    return headers().get(normalizeRawKey(rawKey))
}


function deNormalizeKey(headerName: string) {
    if (headerName.slice(0, 4) === "ctx-")
        headerName = headerName.slice(4)
    return headerName
}

export function withContext(
    allowedRawKeys: string[],
    middleware: (
        req: NextRequest,
        setContext: (key: string, value: string) => void,
    ) => void | NextResponse,
) {
    let contextItems = []
    for (const key of allowedRawKeys) {
        contextItems.push(normalizeRawKey(key))
    }

    return async (req: NextRequest) => {

        req.headers.forEach((value, rawKey) => {
            if (contextItems.includes(rawKey)) {
                throw Error("Header spoofing attempt! Rejecting request...")
            }
        })
        const context: any[] = []
        const setContext = (rawKey: string, value: string) => {
            if (typeof value !== "string")
                throw new Error("Context value must be string")

            rawKey = rawKey.toLowerCase()
            if (allowedRawKeys.includes(rawKey))
                context.push([normalizeRawKey(rawKey), value])
            else throw new Error(`Key "${rawKey}" is not included in the allowed key argument list`)
        }

        let res = await Promise.resolve(middleware(req, setContext)) || NextResponse.next()

        if (context.length === 0) {
            return res
        }

        if (res.headers.get("Location")) {
            return res
        }

        const reqURL = new URL(req.url)

        const rewriteURL = new URL(res.headers.get('x-middleware-rewrite') || reqURL.href)

        // Don't modify cross-origin rewrites
        if (reqURL.origin !== rewriteURL.origin) {
            return res
        }

        for (const [key, value] of Object.entries(context)) {
            res.headers.set(key, value)
        }

        res.headers.set("x-middleware-rewrite", rewriteURL.href)

        return res;

    }
}