"use client";

import React from "react";
import { OrderProvider } from "../../../../../contexts/OrderContext"; // Adjust path as needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      {children}
    </OrderProvider>
  );
}