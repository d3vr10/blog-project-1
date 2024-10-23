"use client";
import {useCreateBlockNote} from "@blocknote/react";
import {useEffect, useState} from "react";

const BlocksToHTML: React.FC<{ content: string }> = ({content}) => {
    const editor = useCreateBlockNote({
        initialContent: content? JSON.parse(content) : undefined
    })
    const [html, setHtml] = useState<null | string>(null)
    useEffect(() => {
        (async function () {
           const html = await editor.blocksToHTMLLossy(editor.document)
           setHtml(html)
        })()
    }, []);
    if (!html)
        return <p>Loading...</p>
    return <div dangerouslySetInnerHTML={{__html: html}}></div>
}

export default BlocksToHTML;