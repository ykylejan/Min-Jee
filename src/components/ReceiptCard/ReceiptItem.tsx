import React from "react";

interface ReceiptItemProps {
  img?: string;
  name?: string;
  price?: number | string;
  category?: string;
  quantity?: number | string;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({
  img,
  name,
  price,
  category,
  quantity,
}) => {
  return (
    <>
      <div className="flex py-6">
        <img
          src={img}
          alt="product"
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
            <h1 className="text-lg">{category}</h1>
            <h1 className="text-lg">Qty {quantity || 1}</h1>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default ReceiptItem;