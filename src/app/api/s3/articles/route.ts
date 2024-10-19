import {s3Client} from "@/lib/s3/upload-article";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import env from "@/lib/env";

export async function GET(req: Request) {
    // const res = await downloadImage([user, title, filename].join("/"))
    const res = await downloadImage({Key: "turnout.jpg", Bucket: "tmp"})
    return new Response(res.body, {
        headers: {...res.headers},
        status: 200,
    })
}

async function downloadImage({
                                 Key,
                                 Bucket,
                             }: {
    Key: string,
    Bucket: string,
}) {
    const getCommand = new GetObjectCommand({
        Key,
        Bucket,
    })
    const res = await s3Client?.send(getCommand)
    return {
        body: res.Body.transformToWebStream(),
        headers: {
            "Content-Length": res.ContentLength,
            "Content-Type": res.ContentType,
        }
    }
}