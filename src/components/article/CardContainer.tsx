"use client";
import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@/components/article/CardSkeleton";

export default function CardContainer({article}: { article: any }) {
    const [url, setUrl] = useState<string | undefined>(undefined);
    const [ready, setReady] = useState<boolean>(false)

    useEffect(() => {
        let fileURL = null
        try {
            if (article.featuredImage) {
                const byteString = atob(article.featuredImage.byteString)
                const bytes = new Uint8Array(byteString.length)
                for (let i = 0; i < byteString.length; i++) {
                    bytes[i] = byteString.charCodeAt(i)
                }
                const blob = new Blob([bytes as BlobPart], {type: article.featuredImage.mimeType})
                fileURL = URL.createObjectURL(blob)
                setUrl(fileURL)
            }
        } catch (err: any) {
        } finally {
            setReady(true)
        }
        return () => {
            if (fileURL)
                URL.revokeObjectURL(fileURL)
        }
    }, [article.featuredImage])

    if (!ready) {
        return <Skeleton/>
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <Image src={url ? url : "/images/not-found.jpg"} width={300}
                           height={300}
                           className="aspect-video object-cover w-full rounded-xl"
                           alt="Article's Featured Image"/>
                </CardHeader>
                <CardContent>
                    <Link href={`/articles/${article.slug}`}>
                        <CardTitle>{article.title}</CardTitle>
                    </Link>
                    <CardDescription>{article.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>Footer</CardFooter>
            </Card>
        </div>
    )
}