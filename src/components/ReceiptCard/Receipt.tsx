import React from "react";
import OrderReceipt, { OrderReceiptData } from "./OrderReceipt";

interface ReceiptProps {
  data?: OrderReceiptData;
  variant?: "compact" | "full";
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

/**
 * Receipt component - A wrapper around OrderReceipt for backwards compatibility
 * Use OrderReceipt directly for new implementations
 */
const Receipt: React.FC<ReceiptProps> = ({
  data,
  variant = "full",
  showHeader = true,
  headerTitle = "Order Successful",
  headerSubtitle = "We appreciate your order, we are currently processing it. Hang on tight and we'll send you confirmation soon!",
  actionButton = {
    label: "Continue Shopping",
    href: "/shop",
  },
}) => {
  // If no data is provided, show placeholder message
  if (!data) {
    return (
      <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
        <p className="text-gray-500 text-center">No receipt data available</p>
      </div>
    );
  }

  return (
    <OrderReceipt
      data={data}
      variant={variant}
      showHeader={showHeader}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      actionButton={actionButton}
    />
  );
};

export default Receipt;
