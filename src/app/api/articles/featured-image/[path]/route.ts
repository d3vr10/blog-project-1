import {retrieveFileContents} from "@/lib/fs/file-storage";
import path from "path"

export async function GET(req, { params: {path: encodedPath}}: { params: { path: string}}) {
    const filePath = decodeURIComponent(encodedPath)
    const bytes = retrieveFileContents(filePath)
    const res = new Response(bytes, {
        status: 200, headers: {
            "Content-Type": `image/${path.extname(filePath).slice(1)}`,
            "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,

        }
    })
    return res
}