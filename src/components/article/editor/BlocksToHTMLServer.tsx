"use client";

import {ServerBlockNoteEditor} from "@blocknote/server-util";
import {type PartialBlock} from "@blocknote/core";

export default function BlocksToHTMLServer({content}: { content?: string | PartialBlock[] | null}) {
    const a = ServerBlockNoteEditor.create()
    return (
        <div>pinga</div>
    )
}
