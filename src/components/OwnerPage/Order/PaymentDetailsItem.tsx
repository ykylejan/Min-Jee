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
  // transactionDetails is now an array
  const payments = Array.isArray(order?.transactionDetails)
    ? order.transactionDetails
    : [];

  const customerName = order?.customer
    ? `${order.customer.firstName} ${order.customer.lastName}`
    : "N/A";

  return (
    <div className="w-80 border border-neutral-200 rounded-lg font-afacad text-neutral-600 px-8 py-5 mt-5">
      <h1 className="font-afacad_semibold text-xl">Payment Receipts</h1>
      <div className="-space-y-2 mb-2">
        <h1>{customerName}</h1>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {payments.length > 0 ? (
          payments.map((payment: any, idx: number) => (
            <div key={payment.id} className="flex items-center gap-x-3">
              <Download width={16} height={16} />
              {payment.img ? (
                <Dialog>
                  <DialogTrigger>
                    <h1 className="underline cursor-pointer">
                      Receipt {idx + 1}
                    </h1>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Payment Receipt</DialogTitle>
                      <DialogDescription className="max-h-[70vh] overflow-y-auto"></DialogDescription>
                    </DialogHeader>
                    <img
                      src={payment.img}
                      alt={`Receipt ${idx + 1}`}
                      className="h-auto w-auto object-cover"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Ref No: {payment.id}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <span className="text-gray-400">No receipt</span>
              )}
            </div>
          ))
        ) : (
          <span className="text-gray-400">No receipts</span>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailsItem;
