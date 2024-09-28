import Image from "next/image";
import { Card, CardTitle, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
import db from "@/lib/db";
export default async function Home() {
  const articles = await db.query.articleSchema.findMany()
  return (
    <div className="grid lg:grid-cols-3">
      {articles.map((article) => (
        <Card>
          <CardHeader>
            <Image src={article.featuredImageURL || "/images/not-found.png"} width={300} height={300} alt="Article's Featured Image" />
          </CardHeader>
          <CardContent>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>{article.excerpt}</CardDescription>
          </CardContent>
          <CardFooter>{new Date().toString()}</CardFooter>
        </Card>
      ))}

    </div>
  );
}
