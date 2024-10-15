import {NextResponse} from "next/server";
import {withContext} from "./lib/middleware/pass-context";

const allowedKeys: string[] = ["hello"]

const protectedRoutes = [
    "/dashboard",
    "/dashboard/create",
    "/dashboard/edit",
]
export default withContext(allowedKeys, async (req, setContext) => {
    //Add current url path to request headers
    const newHeaders = new Headers()
    newHeaders.set("x-current-path", req.nextUrl.pathname)

    if (protectedRoutes.includes(req.nextUrl.pathname)) {
        const url = new URL("/api/validate-session", req.nextUrl.origin)
        const validationResult = await fetch(url, {
            headers:{
                "Cookie": req.cookies.toString(),
            },
            method: "PUT",
        })
        if (!validationResult.ok) {
            return NextResponse.redirect(req.nextUrl.origin)
        }
    }

    return NextResponse.next({headers: newHeaders})
});