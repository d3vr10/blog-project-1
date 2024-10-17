import * as fs from "node:fs";
import path from "path";
import env from "@/lib/env";

export async function storeFile({file, title, username}: { file: File, title: string, username: string }) {
    try {
        const data = await file.arrayBuffer()
        const key = path.posix.join(username, title, file.name)
        const absoluteDirPath = path.join(process.cwd(), env.ARTICLE_DIR)
        await fs.promises.mkdir(path.join(absoluteDirPath, key.split(path.posix.sep).slice(0, 2).join(path.posix.sep)), {recursive: true})
        await fs.promises.writeFile(path.join(absoluteDirPath, key), new Uint8Array(data));

        return key
    } catch (err) {
        throw err
    }
}

export function buildArticlePath(key: string) {
    return path.join(process.cwd(), env.ARTICLE_DIR, key)
}
export async function retrieveFileContents(key: string) {
    return await fs.promises.readFile(buildArticlePath(key))
}

export async function removeArticleImage(key: string) {
    await fs.promises.rm(
        path.join(process.cwd(),
            env.ARTICLE_DIR,
            key.split(path.posix.sep)
                .slice(0, 2)
                .join(path.posix.sep)),
        {force: true, recursive: true},
    )
}

export async function removeUserImageDir(key: string) {
    await fs.promises.rm(path.join(process.cwd(), env.ARTICLE_DIR, key.split(path.posix.sep)[0]), {
        recursive: true,
        force: true
    })
}