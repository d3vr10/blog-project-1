import {NextApiRequest} from "next";
import {validateSession} from "@/lib/auth/actions";
import {NextRequest, NextResponse} from "next/server";

export async function PUT (req: NextRequest) {
    const result = await validateSession()
    return NextResponse.json(result, {status: result.status})
}