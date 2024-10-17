"use client";
import {useCreateBlockNote} from "@blocknote/react";
import {useEffect, useState} from "react";

const BlocksToHTML: React.FC<{ content: string }> = ({content}) => {
    const editor = useCreateBlockNote({
        initialContent: JSON.parse(content)
    })
    const [html, setHtml] = useState<null | string>(null)
    useEffect(() => {
        editor.blocksToFullHTML(editor.document)
            .then((html) => setHtml(html))
    }, []);
    if (!html)
        return <p>Loading...</p>
    return <div dangerouslySetInnerHTML={{__html: html}}></div>
}

export default BlocksToHTML;