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
    <div className="w-full bg-neutral-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-neutral-200">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Image - fixed square */}
        <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200">
          {product.img ? (
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
              No Image
            </div>
          )}
        </div>
        
        {/* Product info + price */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <div className="min-w-0">
            <h3 className="font-afacad_semibold text-sm sm:text-lg leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="font-afacad text-xs sm:text-base text-neutral-500 capitalize">
              {product.type}
            </p>
            <p className="font-afacad text-xs sm:text-base text-neutral-500">
              Qty: {product.quantity}
            </p>
          </div>
          <div className="font-afacad_semibold text-sm sm:text-xl text-primary sm:text-right flex-shrink-0">
            PHP {Number(product.price || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsItem;
