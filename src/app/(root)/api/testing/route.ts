import {NextRequest, NextResponse} from "next/server";

export  async function GET (req: NextRequest) {
    return NextResponse.json({
        searchParams: req.nextUrl.searchParams,
        theNumber: Math.random(),
    })
}