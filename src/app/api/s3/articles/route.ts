import {rateLimit} from "@/lib/server-utils";


export const GET = rateLimit(async (req: Request) => {
    const formData = await req.formData()
    const file = formData.get("file") as unknown as File | null
    if (!file) {
        return Response.json({
            status: 429,
            error: {
                message: "File not found. Terminating"
            }
        }, {status: 429})
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const effectiveFilename = file.name.replace("", "_")


}, {})