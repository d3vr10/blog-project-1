import { NextRequest } from "next/server";
import { withContext } from "./lib/middleware/pass-context";

const allowedKeys: string[] = ["hello"]

export default withContext(allowedKeys, (req, setContext) => {
    const s = req.ip
});