import ArticleTable from "@/components/dashboard/article-table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteArticle } from "@/lib/articles/actions";
import db from "@/lib/db";
import { articleSchema, userSchema } from "@/lib/db/schemas";
import { paginate } from "@/lib/db/utils";
import { eq } from "drizzle-orm";
import { Trash, Pencil } from "lucide-react"

export default async function Page(params: any) {
    const query = db
        .select()
        .from(articleSchema)
        .innerJoin(userSchema, eq(articleSchema.userId, userSchema.id))
    const page = await paginate(query.$dynamic(), 1, 10, articleSchema.id)
    return (
        <ArticleTable page={page} />

    )
}