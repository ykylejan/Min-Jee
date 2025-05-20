import { Download } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentDetailsItemProps {
  order: any;
}

const PaymentDetailsItem: React.FC<PaymentDetailsItemProps> = ({ order }) => {
  // Safely extract payment details from order
  const payment = order?.transactionDetails || {};
  const paymentMethod = payment?.payment || "N/A";
  const refNo = payment?.id || "N/A";
  const receiptImg = payment?.img || "";
  const customerName = order?.customer
    ? `${order.customer.firstName} ${order.customer.lastName}`
    : "N/A";

  return (
    <div className="w-80 h-40 border border-neutral-200 rounded-lg font-afacad text-neutral-600 px-8 py-5 mt-5">
      <h1 className="font-afacad_semibold text-xl">{paymentMethod}</h1>

      <div className="-space-y-2">
        <h1>{customerName}</h1>
        <h1>Ref No: {refNo}</h1>
      </div>

      <div className="flex justify-between mt-3">
        <div className="flex items-center gap-x-3">
          <Download width={16} height={16} />
          {receiptImg ? (
            <Dialog>
              <DialogTrigger>
                <h1 className="underline cursor-pointer">Receipt.png</h1>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment Receipt</DialogTitle>
                  <DialogDescription className="max-h-[70vh] overflow-y-auto">
                    <img
                      src={receiptImg}
                      alt="Receipt"
                      className="h-auto w-auto object-cover"
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-gray-400">No receipt</span>
          )}
        </div>
        {/* Optionally, show a payment icon based on payment method */}
        {/* <img src={icons.gcashActive.src} width={30} height={25} /> */}
      </div>
    </div>
  );
};

export default PaymentDetailsItem;
