"use client";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";

const ArticleCard = ({article, parentLoadingState}) => {
    const blob: any = useRef(null)
    const [url, setURL] = useState<undefined | string>(undefined);
    const [date, setDate] = useState<undefined | string>(undefined);
    useEffect(() => {
        if (window !== undefined) {
            setDate(new Date().toLocaleString())
            const byteString = atob(article.featuredImage.byteString)
            const uint8Array = new Uint8Array(byteString.length)
            for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i)
            }
            blob.current = new Blob([uint8Array as BlobPart], {type: article.featuredImage.mimeType})
            setURL(URL.createObjectURL(blob.current))
            parentLoadingState.setLoading(false)
        }
    }, [])

    return (
        <>
            <Card key={article.id}>
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
                <CardFooter>{date}</CardFooter>
            </Card>
        </>
    )
}

export default ArticleCard;