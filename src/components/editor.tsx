"use client";

import "@blocknote/mantine/style.css"
import "@blocknote/core/fonts/inter.css"
import {BlockNoteView} from "@blocknote/mantine";
import {BlockNoteEditor, PartialBlock} from "@blocknote/core";
import {cn} from "@/lib/utils";
import {useMemo} from "react";

interface Editor {
    initialContent?: string,
    uploadFile?: (file: File) => Promise<string>,
    className?: string,
    editable?: boolean,
    onChange?: () => void,
}

const Editor: React.FC<Editor> = ({initialContent, uploadFile, className, editable}) => {
    const editor = useMemo(() => {
        if (initialContent === "loading")
            return undefined
        const content =  initialContent ? JSON.parse(initialContent) : undefined
        return BlockNoteEditor.create({
            initialContent: content,
            uploadFile: uploadFile,
        })
    }, [initialContent])

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