import {headers} from "next/headers";

export function getServerRequestPathname() {
    const path = headers().get("x-current-path")
    if (!path)
        throw new Error("x-current-path is not being set properly on the middleware. Please check!")
    return path
}
