import db from "@/lib/db";
import {retrieveFileContents} from "@/lib/fs/file-storage";
import path from "path";
import {default as ArticleCard} from "@/components/article-card"

export default async function Home() {
    const articles = await db.query.articleSchema.findMany()

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {articles.map((article) => {
                const encodedArticle: Omit<typeof article, "featuredImage"> & {
                    featuredImage?: {
                        name: string,
                        byteString: string,
                        mimeType: string,
                    }
                } = {...article, featuredImage: undefined}
                if (article.featuredImage) {
                    const binary = retrieveFileContents(article.featuredImage)
                    const base64Encoded = Buffer.from(binary).toString("base64")

                    encodedArticle.featuredImage = {
                        name: path.basename(article.featuredImage),
                        byteString: base64Encoded,
                        mimeType: `image/${path.extname(article.featuredImage).slice(1)}`,
                    }


                }
                return (
                    <ArticleCard key={article.id} article={encodedArticle} suppressHydrationWarning />
                )
            })
            }


        </div>
    );
}
