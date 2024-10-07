import * as fs from "node:fs";
import path from "path";
import {v7} from "uuid";

export async function storeFile(file: File) {
    const data = await file.arrayBuffer()
    const parentDir = path.join(process.cwd(), "articlesData", v7())
    const filePath = path.join(parentDir, file.name + `.${file.type.split("/")[1]}`)
    try {
        fs.mkdirSync(parentDir, { recursive: true })
        fs.writeFileSync(filePath, new Uint8Array(data));

    } catch(err) {
        throw err
    }
    return filePath
}

export  function retrieveFileContents(filePath: string){
    return fs.readFileSync(filePath)
}

export function removeFileContents(filePath: string){
    fs.rmSync(filePath, {force: true})
}