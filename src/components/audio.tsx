"use client"
import {useEffect, useRef, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {ToastAction} from "@/components/ui/toast";

export default function AudioComponent() {
    const {toast} = useToast()
    const audioRef = useRef<any>()
    const intervIdRef = useRef<null | any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("/sound/monodrone.mp4")
            audioRef.current.loop = true
            const currentPlayback = Number(localStorage.getItem("playbackPosition"))
            const alreadyStarted = !isNaN(currentPlayback) && currentPlayback > 0
            if (alreadyStarted) {
                toast({
                    title: "Resume Background Music",
                    description: (<div>So how was it!?<br/>Want to keep going from where you left off?</div>),
                    action: (
                        <>
                            <ToastAction onClick={() => {
                                audioRef.current.currentTime = currentPlayback
                                audioRef.current.play()
                                intervIdRef.current = setInterval(
                                    () => localStorage.setItem("playbackPosition", audioRef.current.currentTime),
                                    2000
                                )
                            }} altText="Yes"
                                         className={"border-green-300 hover:bg-green-500"}
                            >
                                Yeah!
                            </ToastAction>
                            <ToastAction altText="No"
                                         onClick={() => localStorage.removeItem("playbackPosition")}>
                                Nahh!
                            </ToastAction>

                            <ToastAction altText="From the beginning" onClick={() => {
                                localStorage.removeItem("playbackPosition")
                                audioRef.current.load()
                                audioRef.current.play()
                                intervIdRef.current = setInterval(
                                    () => localStorage.setItem("playbackPosition", audioRef.current.currentTime),
                                    2000
                                )
                            }}>Reset</ToastAction>
                        </>
                    )


                })
            } else toast({
                title: "Soundtrack Autoplay",
                description: <div>What about some music while skimming through the site. <span
                    className={"text-green-400 font-bold"}>Cur10u$</span>?</div>,
                action: (
                    <>
                        <ToastAction onClick={() => {

                            audioRef.current.play()
                            intervIdRef.current = setInterval(
                                () => localStorage.setItem("playbackPosition", audioRef.current.currentTime),
                                2000,
                            )
                        }} altText="Yes"
                                     className={"border-green-300 hover:bg-green-500"}>
                            Yeah!
                        </ToastAction>
                        <ToastAction altText="No"
                                     onClick={() => localStorage.removeItem("playbackPosition")}>Nahh!</ToastAction>
                    </>
                ),
            })

        }
    }, [])
    return (
        <></>
    )
}