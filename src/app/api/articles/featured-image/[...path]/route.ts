import {buildArticlePath} from "@/lib/fs/file-storage";
import path from "path"
import {streamFile} from "@/lib/streams/streams";
import fs from "node:fs";

export async function GET(req: Request, {params: {path: encodedPath}}: { params: { path: string[] } }) {
    try {
        encodedPath[2] = decodeURIComponent(encodedPath[2])
        const key = encodedPath.join("/")
        const fileStats = await fs.promises.stat(buildArticlePath(key))
        const webStream = streamFile(buildArticlePath(key))
        return new Response(webStream, {
            status: 200, headers: {
                "Content-Type": `image/${path.extname(key).slice(1)}`,
                "Content-Disposition": `attachment; filename="${path.basename(key)}"`,
                "Content-Length": fileStats.size.toString(),
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