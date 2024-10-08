"use client";

import Image from "next/image";

export default function Previsualizer({watch}) {
    const file = watch("featuredImage")
    return file && (file as FileList).length > 0
        ? <Image src={URL.createObjectURL(file[0])} alt="a" height={400} width={400}
                 className={"object-cover"}/>
        : ""
}