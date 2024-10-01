"use client";

import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteArticle } from "@/lib/articles/actions";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { type PaginatedResult } from "@/lib/db/utils";
import { useState } from "react";
import { useAuth } from "../auth/context";
import Link from "next/link";

export default function ArticleTable({ page: initialPage }: { page: PaginatedResult }) {
    const { toast } = useToast()
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
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {page.items.map((joinRows) => (
                    <TableRow key={joinRows.article.id}>
                        <TableCell className="font-medium">{joinRows.article.title}</TableCell>
                        <TableCell>{joinRows.article.visible}</TableCell>
                        <TableCell>{joinRows.article.visible}</TableCell>
                        <TableCell className="text-right">{joinRows.user.username}</TableCell>
                        <TableCell className="text-right"><Link href={`/articles/edit/${joinRows.article.slug}`}><Button><Pencil /></Button></Link></TableCell>

                        <TableCell className="text-right"><Button onClick={() => handleDelete(joinRows.article.slug)}><Trash /></Button></TableCell>

                    </TableRow>
                ))}

            </TableBody>
        </Table >
    )
}