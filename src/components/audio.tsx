"use client"
import {useEffect, useRef} from "react";
import {useToast} from "@/hooks/use-toast";
import {ToastAction} from "@/components/ui/toast";

export default function AudioComponent() {
    const {toast} = useToast()
    const audioRef = useRef<any>()
    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("/sound/monodrone.mp4")
            toast({
                title: "Soundtrack Autoplay",
                description: <div>What about some music while skimming through the site. <span
                    className={"text-green-400 font-bold"}>Cur10u$</span>?</div>,
                action: (
                    <>
                        <ToastAction onClick={() => audioRef.current.play()} altText="Yes"
                                     className={"border-green-300 hover:bg-green-500"}>Yeah!</ToastAction>
                        <ToastAction altText="No">Nahh!</ToastAction>
                    </>
                ),
            })
        }
    }, [])
    return (
        <></>
    )
}