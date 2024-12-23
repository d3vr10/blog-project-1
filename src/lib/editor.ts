"use client";
import {BlockNoteEditor} from "@blocknote/core";
import {mvObjectInBatch, MvParams} from "@/actions/s3";

export async function commitEditorMedia(editor: BlockNoteEditor, {
    username,
    slug,
}: {
    username: string,
    slug: string,
}) {
    const mediaBlocks: any[] = []
    editor.forEachBlock((block: any) => {
        if (block.props.url) {
            mediaBlocks.push(block)
        }
        return true
    })
    if (mediaBlocks.length === 0) {
        return;
    }
    const mvParams: MvParams[] = []
    for (const block of mediaBlocks) {
        const oldKey = block.props.url.split("/").pop()
        const key = `${username}/${slug}/${oldKey}`
        mvParams.push(
            {
                src: {
                    Bucket: "tmp",
                    Key: oldKey,
                }, dst: {
                    Bucket: "media",
                    Key: key,
                }
            }
        )
    }

    const res = await mvObjectInBatch(mvParams)

    for (const block of mediaBlocks) {
        const url = new URL(block.props.url)
        const oldKey = block.props.url.split("/").pop()
        const key = `${username}/${slug}/${oldKey}`
        url.pathname = `/api/s3/articles/editor/${key}`
        block.props.url = url.href
    }

    localStorage.setItem("editorContent", JSON.stringify(editor.document))

}