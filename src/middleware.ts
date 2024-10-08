import {NextRequest, NextResponse} from "next/server";
import { withContext } from "./lib/middleware/pass-context";
import { validateSession } from "@/lib/auth/validate/actions";
import {redirect} from "next/navigation";

const allowedKeys: string[] = ["hello"]

const protectedRoutes = [
    "/dashboard",
    "/dashboard/create",
    "/dashboard/edit",
]
export default withContext(allowedKeys, async (req, setContext) => {
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
});