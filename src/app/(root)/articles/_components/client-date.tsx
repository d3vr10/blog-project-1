"use client";

import {useEffect, useRef} from "react";

export default function ClientDate() {
    const dateRef = useRef<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            dateRef.current = new Date().toLocaleString()
        }
    }, []);

    return dateRef.current
}