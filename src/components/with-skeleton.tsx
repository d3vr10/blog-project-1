"use client";
import React, {useRef, useState} from "react";

export default function WithSkeleton({TheComponent, Skeleton}: { TheComponent: any, Skeleton: React.ReactElement }) {
    const skeletonRef = useRef(null);
    const componentRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const ClonedSkeleton = React.cloneElement(Skeleton, {ref: skeletonRef})
    const result = <TheComponent />
    return (
        <div>
            {Skeleton}
            <TheComponent />
        </div>
    )

}