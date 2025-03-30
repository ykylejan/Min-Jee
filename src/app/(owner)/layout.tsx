import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";
import OwnerLayout from "@/components/OwnerLayout";

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
                <OwnerLayout>
                    {children}
                    <Toaster />
                </OwnerLayout>
            </body>
        </html>
    );
}
