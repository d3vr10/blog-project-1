import {NextRequest, NextResponse} from "next/server";
import {rateLimit} from "@/lib/server-utils";

export const GET = rateLimit((req: NextRequest) => {
    return NextResponse.json({
        test: "true",
    })
})

