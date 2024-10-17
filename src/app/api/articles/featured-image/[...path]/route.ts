import {retrieveFileContents} from "@/lib/fs/file-storage";
import path from "path"

export async function GET(req, {params: {path: encodedPath}}: { params: { path: string[] } }) {
    try {
        encodedPath[2] = decodeURIComponent(encodedPath[2])
        const key = encodedPath.join("/")

        const bytes = retrieveFileContents(key)

        return new Response(bytes, {
            status: 200, headers: {
                "Content-Type": `image/${path.extname(key).slice(1)}`,
                "Content-Disposition": `attachment; filename="${path.basename(key)}"`,

            }
        })
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return Response.json({
                status: 404,
                error: {
                    message: "Image wasn't found"
                }
            }, {status: 404});
        }
    }
    return Response.json({
        status: 500,
        error: {
            message: "Unknown Error",
        }
    }, {status: 500})
}