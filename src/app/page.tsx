import Image from "next/image";
import { Card, CardTitle, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
import db from "@/lib/db";
import Link from "next/link";
export default async function Home() {
  const articles = await db.query.articleSchema.findMany()

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {articles.map((article) => (

        <Card key={article.id}>
          <CardHeader>
            <Image src={"/images/not-found.jpg"} width={300} height={300} className="aspect-video object-cover w-full rounded-xl" alt="Article's Featured Image" />
          </CardHeader>
          <CardContent>
            <Link href={`/articles/${article.slug}`}>
              <CardTitle>{article.title}</CardTitle>
            </Link>
            <CardDescription>{article.excerpt}</CardDescription>
          </CardContent>
          <CardFooter>{new Date().toString()}</CardFooter>
        </Card>
      ))}

    </div>
  );
}
