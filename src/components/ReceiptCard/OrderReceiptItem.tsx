import React from "react";

interface OrderReceiptItemProps {
  id?: string;
  img?: string;
  name?: string;
  price?: number | string;
  type?: string;
  category?: string;
  quantity?: number | string;
  variant?: "compact" | "full";
}

const OrderReceiptItem: React.FC<OrderReceiptItemProps> = ({
  img,
  name,
  price,
  type,
  category,
  quantity,
  variant = "full",
}) => {
  if (variant === "compact") {
    return (
      <div className="flex gap-3">
        <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
          {img ? (
            <img
              src={img}
              alt={name || "product"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">
              No img
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-afacad_semibold text-sm leading-tight line-clamp-2">
            {name}
          </p>
          <p className="text-xs text-neutral-500 capitalize">
            {type || category}
          </p>
          <p className="text-xs text-neutral-500">x{quantity || 1}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-afacad_semibold text-sm text-primary">
            PHP {Number(price || 0).toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  // Full variant (desktop view)
  return (
    <>
      <div className="flex py-6">
        <img
          src={img}
          alt={name || "product"}
          className="h-[103px] aspect-square rounded-md object-cover"
        />
        <div className="w-full pl-4">
          <div className="flex justify-between w-full font-afacad_medium">
            <h1 className="text-2xl font-afacad_semibold">{name}</h1>
            <h1 className="text-xl">
              PHP {price ? Number(price).toFixed(2) : "0.00"}
            </h1>
          </div>
          <div className="text-[#6B7280] flex flex-col font-afacad space-y-5">
            <h1 className="text-lg">{type || category}</h1>
            <h1 className="text-lg">Qty {quantity || 1}</h1>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default OrderReceiptItem;
