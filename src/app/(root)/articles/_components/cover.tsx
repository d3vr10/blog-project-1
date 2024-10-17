"use client";

import Image from "next/image";
import {cn} from "@/lib/utils";
import {clsx} from "clsx";
import {Button} from "@/components/ui/button";
import {UseFormGetFieldState, type UseFormRegisterReturn, UseFormStateReturn} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {useRef} from "react";

interface Cover {
    watch: any,
    className?: string,
    fileInputRef: UseFormRegisterReturn<any>,
    fieldState: any,
}

const Cover: React.FC<Cover> = ({watch, className, fileInputRef: {ref, ...rest}, fieldState}) => {
    const file = watch("featuredImage")
    const fileInputJSXRef = useRef<HTMLInputElement | null>(null);
    return (
        <div className={cn(
            clsx(
                {
                    "bg-neutral-400 group": !(file && file[0]),
                },
                "w-full aspect-video relative"
            ),
            className,
        )}>
            {file && file[0] &&
                <Image src={file[0]} alt="a" fill sizes="w-full" className={"object-cover"}/>
            }
            <Button
                className={clsx({
                        "bg-neutral-200": file && file[0],
                    },
                    "absolute right-10 bottom-10"
                )}
                onClick={() => {
                    fileInputJSXRef.current?.click()
                }}
                type={"button"}
            >
                Upload File
            </Button>
            <Input className={"hidden"} type={"file"} {...rest} ref={(e) => {
                ref(e)
                fileInputJSXRef.current = e
            }} />
            <div className={"text-destructive font-extrabold text-2xl"}>{fieldState.error? fieldState.error.message: ""}</div>
        </div>
    )
}

export default Cover;