import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "Min-Jee",
    description: "A party needs and services website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Navbar/>
                {children}
                <Toaster />
                <Footer/>
            </body>
        </html>
    );
}
