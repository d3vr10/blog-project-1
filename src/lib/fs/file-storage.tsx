import * as fs from "node:fs";
import path from "path";
import {v7} from "uuid";

export async function storeFile(file: File) {
    const data = await file.arrayBuffer()
    const parentDir = path.join(process.cwd(), "articlesData")
    const filePath = path.join(parentDir, v7() + `.${file.type.split("/")[1]}`)
    try {
        fs.mkdirSync(parentDir, { recursive: true })
        fs.writeFileSync(filePath, new Uint8Array(data));

    } catch(err) {
        throw err
    }
    return filePath
}

export  function retrieveFileContents(filePath: string){
   const data = fs.readFileSync(filePath)
    return data
}

export function removeFileContents(filePath: string){
    fs.rmSync(filePath, {force: true})
}