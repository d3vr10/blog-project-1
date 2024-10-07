import Component from "@/app/testing/_components/client-side-revalidation";

export default function Page() {
    /*This route was just for learning about nextjs' data cache revalidation on-demand and is kept here for historical hair-loss reasons*/
    return (

        <div className={"flex flex-col items-center"}>
            <span className={"text-5xl font-bold tracking-tight"}>| Time Now | </span> {new Date().toLocaleString()}
            <Component/>
        </div>
    )
}