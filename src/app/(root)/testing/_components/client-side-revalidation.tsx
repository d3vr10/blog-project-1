"use client";
import {revalidatePathAction} from "@/app/(root)/testing/actions";
import {useRouter} from "next/navigation";

export default function Component() {
    const router = useRouter()
    return (
        <button className={"px-4 py-2 hover:bg-red-500 border-2 rounded-lg transition-colors ease-out border-red-400 mt-2"} onClick={async () => {
            await revalidatePathAction("/testing")
            router.refresh()

        }}>Bust Cache</button>
    )
}
