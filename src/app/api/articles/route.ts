import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
   const articles = await db.query.articleSchema.findMany()
   return NextResponse.json({
      status: 200,
      content: articles,
   })
}