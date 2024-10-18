import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import env from "@/lib/env";
import {Upload} from "@aws-sdk/lib-storage";

export const s3Client = env.S3_ACCESS_KEY_ID
    && env.S3_SECRET_ACCESS_KEY
    && new S3Client({
        forcePathStyle: true,
        credentials: {
            accessKeyId: env.S3_ACCESS_KEY_ID,
            secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
    }) || undefined


interface UploadMediaConfig {
    bucket: string,
    key: string,
    size: number,
}

export async function uploadMedia(file: ReadableStream | File | Blob, params: UploadMediaConfig) {

    if (params.size >= 1024 * 1024 * 5) {
        try {
            const streamUpload = new Upload({
                params: {
                    Body: file,
                    Bucket: params.bucket,
                    Key: params.key,
                },
                client: s3Client as S3Client,
                partSize: 1024 * 1024 * 5, //5MB
            })
            await streamUpload.done()
        } catch (error: any) {
            throw error;
        }

    } else {
        try {
            const buffer = Buffer.from(await (file as File).arrayBuffer())
            const putCommand = new PutObjectCommand({
                Key: params.key,
                Bucket: params.bucket,
                Body: buffer,
            });
            const res = await (s3Client as S3Client).send(putCommand)
        } catch (error: any) {
            throw error;
        }
    }

}