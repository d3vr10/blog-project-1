"use client"

import {ColumnDef} from "@tanstack/react-table"
import {InferSelectModel} from "drizzle-orm"
import {articleSchema} from "@/lib/db/schemas"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {EyeIcon, EyeOffIcon, MoreHorizontal, PencilIcon, TrashIcon} from "lucide-react";
import {deleteArticle, toggleArticleVisibility} from "@/actions/articles";
import {refreshArticles} from "@/actions/revalidate-path-cache";
import Link from "next/link";
import {revalidatePathAction} from "@/app/(root)/testing/actions";

export const columns: ColumnDef<InferSelectModel<typeof articleSchema>>[] = [
    {
        accessorKey: "createdAt",
        header: "Created",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "id",
        header: "Author",
    },
    {
        accessorKey: "visible",
        header: "Visible",
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            className={"text-red-500 flex gap-x-1 items-center cursor-pointer"}
                            onClick={async () => {
                                await deleteArticle(row.original.slug)
                                await refreshArticles()
                            }}
                        >
                            <TrashIcon size={20}/> Delete
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className={"text-yellow-500 cursor-pointer"}
                        >
                            <Link href={`/dashboard/edit/${row.original.slug}`} className={"w-full  flex gap-x-1"}><PencilIcon size={20}/> Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className={"text-blue-500 flex gap-x-1 items-center cursor-pointer"}
                            onClick={async () => {
                                const result = await toggleArticleVisibility(row.original.id)
                                if (result.error) {
                                    alert(result.error.message)
                                    return;
                                }
                                await revalidatePathAction("/dashboard", "page")

                            }}
                        >
                            {row.original.visible? (<><EyeOffIcon size={20}/> Hide</> ) : ( <><EyeIcon size={20}/> Show</> ) }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => alert("Not implemented Yet!")}>View Author
                            Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
