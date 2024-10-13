import * as fs from "node:fs";
import path from "path";
import {v7} from "uuid";
import env from "@/lib/env";

export async function storeFile({file, title, username}: { file: File, title: string, username: string }) {
    try {
        const data = await file.arrayBuffer()
        const key = path.posix.join(username, title, file.name)
        const absoluteDirPath = path.join(process.cwd(), env.ARTICLE_DIR)
        fs.mkdirSync(path.join(absoluteDirPath, key.split(path.posix.sep).slice(0, 2).join(path.posix.sep)), {recursive: true})
        fs.writeFileSync(path.join(absoluteDirPath, key), new Uint8Array(data));

        return key
    } catch (err) {
        throw err
    }
}

export function retrieveFileContents(key: string) {
    return fs.readFileSync(path.join(process.cwd(), env.ARTICLE_DIR, key))
}

export function removeArticleImage(key: string) {
    fs.rmSync(
        path.join(process.cwd(),
            env.ARTICLE_DIR,
            key.split(path.posix.sep)
                .slice(0, 2)
                .join(path.posix.sep)),
        {force: true, recursive: true},
    )
}

export function removeUserImageDir(key: string) {
    fs.rmSync(path.join(process.cwd(), env.ARTICLE_DIR, key.split(path.posix.sep)[0]), {recursive: true, force: true})
}