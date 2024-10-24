"use client";
import {useEffect, useRef, useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@/components/article/CardSkeleton";

export default function ArticleCard({article}: { article: any }) {
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState<string | undefined>(undefined);
    const [show, setShow] = useState<boolean>(false)
    const skeletonRef = useRef(null);
    const articleCardRef = useRef(null);

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
            setShow(true)
        }
        return () => {
            if (fileURL) URL.revokeObjectURL(fileURL)
        }
    }, [])

    if (!show) {
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