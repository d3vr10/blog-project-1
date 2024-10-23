import {GetObjectCommand} from "@aws-sdk/client-s3";
import env from "@/lib/env";
import {s3Client} from "@/lib/s3/upload-article";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest, {params: {username, slug, filename}}: {
    params: { filename: string, username: string, slug: string }
}) {
    const getCommand = new GetObjectCommand({
        Bucket: env.S3_MEDIA_BUCKET,
        Key: `${username}/${slug}/${filename}`,
    })
    const s3Res = await s3Client?.send(getCommand)
    return new Response(s3Res.Body.transformToWebStream(), {
        headers: {
            "Content-Type": s3Res.ContentType,
            "Content-Length": s3Res.ContentLength?.toString(),
            "Content-Disposition": s3Res.ContentDisposition,
        }
    })

}
