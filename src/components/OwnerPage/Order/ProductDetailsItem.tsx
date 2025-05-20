"use client";

import React from "react";
import { Trash, Edit } from "lucide-react";
import Image from "next/image";
import { Product } from "../../../../contexts/OrderContext"; // Adjust path as needed
import { useOrder } from "../../../../contexts/OrderContext"; // Adjust path as needed

interface ProductDetailsItemProps {
  product?: Product;
  editable?: boolean;
}

const ProductDetailsItem: React.FC<ProductDetailsItemProps> = ({ 
  product,
  editable = true
}) => {
  const { removeProduct } = useOrder();

  // If no product provided, use a default placeholder
  if (!product) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between mt-5 px-5">
        <div className="flex">
          <Image
            src={product.image.src}
            alt={product.name}
            width={75}
            height={75}
            className="rounded-lg"
          />

          <div className="ml-7">
            <div className="font-afacad_semibold text-xl">
              {product.name}
            </div>
            <div className="font-afacad text-base text-neutral-500">
              {product.category}
            </div>
            <div className="font-afacad text-base text-neutral-500">
              Qty {product.quantity}
            </div>
          </div>
        </div>

        <div className="font-afacad">
          <div className="font-afacad_medium text-xl">PHP {product.price.toFixed(2)}</div>
          {editable && (
            <>
              <div className="underline cursor-pointer flex justify-end text-neutral-600 hover:text-camouflage-400">
                Edit
              </div>
              <div 
                className="cursor-pointer flex justify-end text-red-400 hover:text-red-700"
                onClick={() => removeProduct(product.id)}
              >
                <Trash size={16}/>
              </div>
            </>
          )}
        </div>
      </div>

      <hr className="w-full mt-3" />
    </div>
  );
};

export default ProductDetailsItem;