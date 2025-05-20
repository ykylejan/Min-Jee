import { Timer, TimerReset } from "lucide-react";
import React from "react";
import { Banknote, Truck } from "lucide-react";
interface OrderDetailsSectionProps {
  order: any;
}

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({ order }) => {
  // Safely extract fields from order
  const orderNumber = order?.id || "N/A";
  const customerName = order?.customer
    ? `${order.customer.firstName} ${order.customer.lastName}`
    : "N/A";
  const contactNumber = order?.customer?.contactNumber || "N/A";
  const location = order?.location || "N/A";
  const obtainmentMethod = order?.isShipped || false;
  const deliveryFee = order?.deliveryPrice;
  const depositFee = order?.depositPrice;
  const orderDate = order?.orderDate
    ? new Date(order.orderDate).toLocaleDateString()
    : "N/A";
  const returnDate = order?.returnDate
    ? new Date(order.returnDate).toLocaleDateString()
    : "N/A";

  return (
    <div className="mt-5 font-afacad text-neutral-600">
      <div className="flex flex-row gap-x-10">
        <div className="space-y-3">
          {/* <h1 className="flex justify-between gap-x-7">
            <span>Order Number:</span>
            <span>{orderNumber}</span>
          </h1> */}
          <h1 className="flex justify-between gap-x-7">
            <span>Customer Name:</span>
            <span>{customerName}</span>
          </h1>
          <h1 className="flex justify-between gap-x-7">
            <span>Contact Number:</span>
            <span>{contactNumber}</span>
          </h1>
        </div>

        <div className="border border-r-0"></div>

        <div className="space-y-3">
          <h1 className="flex justify-between gap-x-7">
            <span>Location:</span>
            <span>{location}</span>
          </h1>
          <div className="space-y-3">
            <h1 className="flex justify-between gap-x-7">
              <span>Obtainment Method:</span>
              <span>{obtainmentMethod ? "Shipped" : "Pick-up"}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-8 w-fit space-y-3">
        <div className="flex items-center gap-x-2">
          <Timer width={16} height={16} />
          <h1 className="flex justify-between gap-x-7">
            <span>Date of Booking:</span>
            <span className="font-afacad text-camouflage-500 underline">
              {orderDate}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-x-2">
          <TimerReset width={16} height={16} />
          <h1 className="flex justify-between gap-x-7">
            <span>Date of Return:</span>
            <span className="font-afacad text-camouflage-500 underline">
              {returnDate}
            </span>
          </h1>
        </div>

        <div className="mt-8 w-fit space-y-3">
          <div className="flex items-center gap-x-2">
            <Truck width={16} height={16} />
            <h1 className="flex justify-between gap-x-7">
              <span>Delivery Fee: {deliveryFee}</span>
            </h1>
          </div>

          <div className="flex items-center gap-x-2">
            <Banknote width={16} height={16} />
            <h1 className="flex justify-between gap-x-7">
              <span>Deposit Fee: {depositFee}</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSection;
