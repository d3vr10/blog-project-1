import type {UseFormRegisterReturn} from "react-hook-form";
import {RefObject} from "react";
import {ColumnDef} from "@tanstack/react-table";

export interface rateLimitOptions {
    attempts?: number,
    resetAfter?: number,
}

export interface Editor {
    initialContent?: string,
    uploadFile?: (file: File) => Promise<string>,
    className?: string,
    editable?: boolean,
    onChange?: () => void,
    editorRef?: RefObject<any>,
}

export interface Cover {
    watch: any,
    className?: string,
    fileInputRef: UseFormRegisterReturn<any>,
    fieldState: any,
}

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}
