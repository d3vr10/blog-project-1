"use client";

import dynamic from "next/dynamic";

export default function BlocksToHTMLContainer({content}: { content?: string | null }) {

    const BlocksToHTMLPresentation = dynamic(() =>
            import("@/components/article/editor/BlocksToHTMLPresentation"),
        {ssr: false}
    );
    return <BlocksToHTMLPresentation content={content}/>
}