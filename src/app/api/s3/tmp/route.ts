import {v7} from "uuid";
import env from "@/lib/env";
import {Upload} from "@aws-sdk/lib-storage";
import {s3Client} from "@/lib/s3/upload-article";

export async function PUT(req: Request) {
    if (!(req.body instanceof ReadableStream) || !(req.headers.get("content-type"))) {
        return Response.json({
            status: 429,
            error: {
                message: "Either unknown file type or binary data has not been supplied"
            }
        })
    }
    try {
        const mimeType = req.headers.get("content-type")
        const filename = `${v7()}.${mimeType.split("/").pop()}`
        const upload = new Upload({
            client: s3Client,
            params: {
                Key: filename,
                Bucket: env.S3_TMP_BUCKET,
                Body: req.body,
            }

        })
        await upload.done()
        return Response.json({
            status: 200,
            message: "File was uploaded successfully",
            url: new URL(`api/s3/tmp/${filename}`, env.NEXT_PUBLIC_SITE_URL)
        })
    } catch(error: any) {
        return Response.json({
            status: 500,
            error: {
                message: "There was an error uploading your media file"
            }
        })
    }
}
