import {Button} from "@/components/ui/button";
import db from "@/lib/db";
import {articleSchema, userSchema} from "@/lib/db/schemas";
import {paginate} from "@/lib/db/utils";
import {eq} from "drizzle-orm";
import {Plus} from "lucide-react"
import Link from "next/link"
import {DataTable} from "@/app/dashboard/_components/data-table";
import {columns} from "@/app/dashboard/_components/column-definitions";

export default async function Page(params: any) {
    const query = db
        .select()
        .from(articleSchema)
        .innerJoin(userSchema, eq(articleSchema.userId, userSchema.id))

    const page = await paginate(query.$dynamic(), 1, 10, articleSchema.id)
    const data = page.items.map((row) => row.article)

    return (
       <div>
           <div className={"flex justify-end mb-4"}>
           <Link href={"/dashboard/create"}><Button><Plus/></Button></Link>
           </div>
        <DataTable columns={columns} data={data} />
       </div>
    )
}