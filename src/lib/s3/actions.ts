"use server";

import {CopyObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import {s3Client} from "@/lib/s3/upload-article";

export interface MvParams {
    src: { Bucket: string, Key: string },
    dst: { Bucket: string, Key: string }
}

export async function mvObject({src, dst}: MvParams) {

    if (!(src.Bucket || dst.Bucket)) {
        throw new Error("You must at least specify either src or dst \".Bucket\" property")
    }
    const copyCommand = new CopyObjectCommand({
        CopySource: `${src.Bucket || dst.Bucket}/${src.Key}`,
        Bucket: dst.Bucket || src.Bucket,
        Key: dst.Key,
    })
    const deleteCommand = new DeleteObjectCommand({
        Key: src.Key,
        Bucket: src.Bucket,
    })
    try {
        const s3CopyRes = await s3Client?.send(copyCommand)
        const s3DeleteRes = await s3Client?.send(deleteCommand)
        return {
            status: 200,
            message: "Uploaded successfully"
        }

    } catch (error: any) {
        return {
            status: 500,
            error: {
                message: "There was an error while moving objects within s3 storage"
            }
        }
    }

}

export async function mvObjectInBatch(batch: MvParams[]) {
    const results = await Promise.allSettled(
        batch.map((mvParam) => mvObject(mvParam))
    )
    const errors = [];

    for (const result of results) {
        if (result.status === "fulfilled" && result.value.error) {
            errors.push(result.value.error)
        }
    }
    const response = {
        status: errors ? 500 : 200,
        message: errors ? "Some errors occurred" : "Success",
    }
    if (errors)
        response.error = {errors}

    return response
}