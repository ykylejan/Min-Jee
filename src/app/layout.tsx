'use client';

import "./globals.css";
import { store } from "../redux/store";
import { Provider } from "react-redux";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
