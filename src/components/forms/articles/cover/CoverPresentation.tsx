import Image from "next/image";
import {cn} from "@/lib/utils";
import {clsx} from "clsx";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRef} from "react";
import {Controller, UseFormRegisterReturn} from "react-hook-form";

interface CoverPresentationProps {
    fileInputRef: UseFormRegisterReturn<any>,
    className?: string;
    fieldState: any; // Specify a more precise type if possible
    imageSrc: string | null;
}

const CoverPresentation: React.FC<CoverPresentationProps> = ({
        imageSrc,
        fileInputRef: {ref, ...rest},
        className,
        fieldState
    }) => {
    const fileInputJSXRef = useRef<HTMLInputElement | null>(null);

    return (
        <div
            className={cn(clsx({"bg-neutral-400 group": !(imageSrc)}, "w-full aspect-video relative"), className)}>
            {imageSrc && (
                <Image src={imageSrc} alt="a" fill sizes="w-full" className={"object-cover"}/>
            )}
            <Button
                className={clsx({"bg-neutral-200": imageSrc}, "absolute right-10 bottom-10")}
                onClick={() => {
                    fileInputJSXRef.current?.click();
                }}
                type={"button"}
            >
                Upload File
            </Button>
            <Input
                className={"hidden"}
                type={"file"}
                {...rest}
                ref={(e) => {
                    ref(e);
                    fileInputJSXRef.current = e;
                }}
            />
            <div className={"text-destructive font-extrabold text-2xl"}>
                {fieldState.error ? fieldState.error.message : ""}
            </div>
        </div>
    );
};

export default CoverPresentation;