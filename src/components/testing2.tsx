"use client";
import {useEffect, useRef, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@/app/articles/_components/card-skeleton";
import {cn} from "@/lib/utils";

export default function Component({article}) {
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState<string | undefined>(undefined);
    const skeletonRef = useRef(null);
    const articleCardRef = useRef(null);

    useEffect(() => {
        const byteString = atob(article.featuredImage.byteString)
        const bytes = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++) {
            bytes[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([bytes as BlobPart], {type: article.featuredImage.mimeType})
        setUrl(URL.createObjectURL(blob))
    }, [])
    return (
        <div key={article.id}>
            <Skeleton className={url? "hidden" : ""} ref={skeletonRef}/>
            <Card className={!url? "hidden" : ""} ref={articleCardRef}>
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