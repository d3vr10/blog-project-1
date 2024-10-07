import db from "@/lib/db";
import { articleSchema, userSchema } from "@/lib/db/schemas";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({ params: { slug } }: { params: { slug: string } }) {
    const [joinedResult] = await db.select()
        .from(articleSchema)
        .innerJoin(userSchema, eq(userSchema.id, articleSchema.userId))
        .where(eq(articleSchema.slug, slug))

    if (!joinedResult) {
        notFound()
    }
    return (
        <div className="py-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                The Joke Tax Chronicles
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Once upon a time, in a far-off land, there was a very lazy king who
                spent all day lounging on his throne. One day, his advisors came to him
                with a problem: the kingdom was running out of money.
            </p>
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                The King&apos;s Plan
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                The king thought long and hard, and finally came up with{" "}
                <a
                    href="#"
                    className="font-medium text-primary underline underline-offset-4"
                >
                    a brilliant plan
                </a>
                : he would tax the jokes in the kingdom.
            </p>
            <blockquote className="mt-6 border-l-2 pl-6 italic">
                &quote;After all,&quote; he said, &quote;everyone enjoys a good joke, so it&apos;s only fair
                that they should pay for the privilege.&quote;
            </blockquote>
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                The Joke Tax
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                The king&quote;s subjects were not amused. They grumbled and complained, but
                the king was firm:
            </p>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>1st level of puns: 5 gold coins</li>
                <li>2nd level of jokes: 10 gold coins</li>
                <li>3rd level of one-liners : 20 gold coins</li>
            </ul>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                As a result, people stopped telling jokes, and the kingdom fell into a
                gloom. But there was one person who refused to let the king&quote;s
                foolishness get him down: a court jester named Jokester.
            </p>
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                Jokester&quote;Revolt
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Jokester began sneaking into the castle in the middle of the night and
                leaving jokes all over the place: under the king&quote;s pillow, in his soup,
                even in the royal toilet. The king was furious, but he couldn&quote;t seem to
                stop Jokester.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                And then, one day, the people of the kingdom discovered that the jokes
                left by Jokester were so funny that they couldn&quote;t help but laugh. And
                once they started laughing, they couldn&quote;t stop.
            </p>
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                The People&quote;s Rebellion
            </h3>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                The people of the kingdom, feeling uplifted by the laughter, started to
                tell jokes and puns again, and soon the entire kingdom was in on the
                joke.
            </p>
            <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="m-0 border-t p-0 even:bg-muted">
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                King&quote;s Treasury
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                People&quote;s happiness
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="m-0 border-t p-0 even:bg-muted">
                            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                Empty
                            </td>
                            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                Overflowing
                            </td>
                        </tr>
                        <tr className="m-0 border-t p-0 even:bg-muted">
                            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                Modest
                            </td>
                            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                Satisfied
                            </td>
                        </tr>
                        <tr className="m-0 border-t p-0 even:bg-muted">
                            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                Full
                            </td>
                            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                Ecstatic
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                The king, seeing how much happier his subjects were, realized the error
                of his ways and repealed the joke tax. Jokester was declared a hero, and
                the kingdom lived happily ever after.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                The moral of the story is: never underestimate the power of a good laugh
                and always be careful of bad ideas.
            </p>
        </div>
        // <article className="flex flex-col gap-y-2">
        //     <h1 className="pb-2 border-b-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{joinedResult.article.title}</h1>
        //     <div className="flex gap-x-4 justify-between">
        //         <div>Por: <span>{joinedResult.user.username}</span></div>
        //         <div></div>
        //     </div>
        //     <div className="lg:w-[75%] mx-auto mt-10">
        //         <blockquote className="mt-6 border-l-2 pl-6 italic">
        //             {joinedResult.article.excerpt}
        //         </blockquote>
        //         <p>{joinedResult.article.content}</p>
        //     </div>

        // </article>
    )
} 