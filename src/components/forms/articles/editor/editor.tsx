"use client";

import "@blocknote/mantine/style.css"
import "@blocknote/core/fonts/inter.css"
import {BlockNoteView} from "@blocknote/mantine";
import {BlockNoteEditor} from "@blocknote/core";
import {cn} from "@/lib/utils";
import {useMemo} from "react";
import {validateSession} from "@/lib/auth/actions";
import {type Editor} from "@/types"
import {useToast} from "@/hooks/use-toast";


const Editor: React.FC<Editor> = ({initialContent, className, editable, editorRef}) => {
    const {toast} = useToast()

    const uploadFile = async (file: File) => {
        const valBody = await validateSession()
        if (valBody.error) {
            throw new Error("You must be authenticated first!")
        }
        const {username} = valBody.payload
        const res = await fetch(`/api/s3/tmp`, {
            body: file,
            method: "PUT",
        })

        if (!res.ok) {
            throw new Error("Couldn't upload image")
        }

        const body = await res.json()
        return body.url
    }

    const editor = useMemo(() => {
        if (initialContent === "loading")
            return null
        const content = initialContent ? JSON.parse(initialContent) : undefined
        return BlockNoteEditor.create({
            initialContent: content,
            uploadFile: uploadFile,
        })
    }, [initialContent])
    if (editorRef)
        editorRef.current = editor

    if (!editor)
        return (
            <div>Loading editor...</div>
        )

    return (
        <BlockNoteView editor={editor} className={cn(className)} editable={editable} onChange={() => {
            if (editor?.document)
                localStorage.setItem("editorContent", JSON.stringify(editor.document))
        }}/>
    )
}

export default Editor;