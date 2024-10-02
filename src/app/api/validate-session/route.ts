import {NextApiRequest} from "next";
import {validateSession} from "@/lib/auth/actions";
import {NextResponse} from "next/server";

export async function PUT (req: NextApiRequest) {
    const result = await validateSession()
    return NextResponse.json(result, {status: result.status})
}