import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";
import OwnerLayout from "@/components/OwnerLayout";
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
      {/* <OwnerAuthRedirect> */}
      <OwnerLayout>
        {children}
        <Toaster />
      </OwnerLayout>
      {/* </OwnerAuthRedirect> */}
    </div>
  );
}
