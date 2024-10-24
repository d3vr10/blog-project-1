"use client";

import {useForm, Controller} from "react-hook-form";
import CoverPresentation from "./CoverPresentation";
import {type Cover} from "@/types";
import {useEffect, useState} from "react";

const CoverContainer: React.FC<Cover> = (
    {
        className, fieldState, watch, fileInputRef
    }
) => {
    const file = watch("featuredImage");
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    // Effect to create an object URL for the selected file
    useEffect(() => {
        if (file && file[0]) {
            const url = URL.createObjectURL(file[0]);
            setImageSrc(url);

            // Clean up function to revoke the object URL
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setImageSrc(null);
        }
    }, [file]);

    return (
        <CoverPresentation
            fileInputRef={fileInputRef}
            imageSrc={imageSrc}
            className={className}
            fieldState={fieldState}
        />
    );
};

export default CoverContainer;