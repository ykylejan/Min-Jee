import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import OwnerAuthRedirect from "@/components/OwnerAuthRedirect";
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
    <div>
      <Navbar />
      {children}
      <Toaster />
      <Footer />
    </div>
  );
}
