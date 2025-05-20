"use client";

import React from "react";
import Image from "next/image";

interface ProductDetailsItemProps {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    img?: string;
    type?: string;
  };
  editable?: boolean;
}

const ProductDetailsItem: React.FC<ProductDetailsItemProps> = ({
  product,
  editable = false, // default to false for order details page
}) => {
  if (!product) return null;

  return (
    <div className="w-full flex flex-row items-center justify-between bg-neutral-50 rounded-lg p-4 mb-4 border border-neutral-200">
      <div className="flex flex-row items-center gap-x-6">
        <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-neutral-200">
          {product.img ? (
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
        </div>
        <div>
          <div className="font-afacad_semibold text-lg">{product.name}</div>
          <div className="font-afacad text-base text-neutral-500 capitalize">
            {product.type}
          </div>
          <div className="font-afacad text-base text-neutral-500">
            Qty: {product.quantity}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-afacad_medium text-xl mb-1">
          PHP {Number(product.price || 0).toFixed(2)}
        </div>
        {/* No edit/remove on details page */}
      </div>
    </div>
  );
};

export default ProductDetailsItem;
