
import Component from "@/app/testing/com";

export const revalidate = 10

export default function Page() {
    return (
        <div className={"w-screen h-screen flex flex-col justify-center items-center"}>
            New time =&gt; {Date.now()}
            <Component/>
        </div>
    )
}