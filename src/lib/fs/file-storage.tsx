import * as fs from "node:fs";
import path from "path";
import {v7} from "uuid";
import env from "@/lib/env";

export async function storeFile({ file, title, username }: { file: File, title: string, username: string}) {
    const data = await file.arrayBuffer()
    const key = path.posix.join(title, username, file.name)
    const absoluteDirPath = path.join(process.cwd(), env.ARTICLE_DIR)
    try {
        fs.mkdirSync(absoluteDirPath, { recursive: true })
        fs.writeFileSync(path.join(absoluteDirPath, key), new Uint8Array(data));

    } catch(err) {
        throw err
    }
    return key
}

export  function retrieveFileContents(key: string){
    return fs.readFileSync(path.join(process.cwd(), env.ARTICLE_DIR, key))
}

export function removeFileContents(key: string){
    fs.rmSync(path.join(process.cwd(), env.ARTICLE_DIR, key.split(path.posix.sep)[0]), {recursive: true, force: true})
}