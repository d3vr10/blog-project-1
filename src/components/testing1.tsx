"use client";
import {cn} from "@/lib/utils";

export default function Skeleton({className, ref}) {
    return (
        <p ref={ref} className={cn(className)}>The Skeleton component</p>
    )
}