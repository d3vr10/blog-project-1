import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer"


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
            <div className={"flex flex-col min-h-screen "}>
                <header className={""}>
                    <Navbar/>
                </header>
                <main className="p-4 container flex-1 self-center">
                    {children}
                </main>
                <Footer/>
            </div>
    );
}
