import {retrieveFileContents} from "@/lib/fs/file-storage";
import path from "path"

export async function GET(req, { params: {path: encodedPath}}: { params: { path: string}}) {
    const key = decodeURIComponent(encodedPath)
    const bytes = retrieveFileContents(key)

    return new Response(bytes, {
        status: 200, headers: {
            "Content-Type": `image/${path.extname(key).slice(1)}`,
            "Content-Disposition": `attachment; filename="${path.basename(key)}"`,

        }
    })
}