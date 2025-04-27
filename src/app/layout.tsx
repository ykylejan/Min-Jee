"use client";

import { ReduxProvider } from "@/redux/provider";
import "./globals.css";
// import { store } from "../redux/store";
// import { Provider } from "react-redux";
import OwnerAuthRedirect from "@/components/OwnerAuthRedirect";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <OwnerAuthRedirect>{children}</OwnerAuthRedirect>
        </ReduxProvider>
      </body>
    </html>
  );
}
