"use client";

import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteArticle } from "@/lib/articles/actions";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { type PaginatedResult } from "@/lib/db/utils";
import { useState } from "react";
import { useAuth } from "@/app/auth/_components/context";
import Link from "next/link";
import {revalidatePathAction} from "@/app/testing/actions";
import {useRouter} from "next/navigation";
import {refreshArticles} from "@/app/actions";

export default function ArticleTable({ page: initialPage }: { page: PaginatedResult }) {
    const { toast } = useToast()
    const router = useRouter()
    const [page, setPage] = useState(initialPage)
    const handleDelete = async (slug: string) => {
        const deleteResult = await deleteArticle(slug)
        if (deleteResult.error) {
            toast({
                title: "Server Error",
                description: "Article couldn't be deleted",
            })
            return;
        }

        setPage(prevPage => ({
                ...prevPage,
                items: prevPage.items.filter(item => item.article.slug !== slug),
        }));

        toast({
            title: "Article was deleted",
            variant: "default",
        })
    }

    return (
        <Table>
            <TableCaption>A list of all articles</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Created At</TableHead>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead className="text-right">Visible</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {page.items.map((joinRows) => {
                    const date = new Date(joinRows.article.createdAt)
                    const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
                    return (
                    <TableRow key={joinRows.article.id}>
                        <TableCell className="font-medium">{formattedDate}</TableCell>
                        <TableCell>{joinRows.article.title}</TableCell>
                        <TableCell>{joinRows.user.username}</TableCell>
                        <TableCell className="text-right">{String(joinRows.article.visible)}</TableCell>
                        <TableCell className="text-right"><Link href={`/dashboard/edit/${joinRows.article.slug}`}><Button><Pencil /></Button></Link></TableCell>

                        <TableCell className="text-right"><Button onClick={async () => {
                            await handleDelete(joinRows.article.slug)
                            await refreshArticles();
                            router.refresh()
                        }}><Trash /></Button></TableCell>

                    </TableRow>
                )})}

            </TableBody>
        </Table >
    )
}