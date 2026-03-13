"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

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
  isUpdating?: boolean;
  isRemoving?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}

const ProductDetailsItem: React.FC<ProductDetailsItemProps> = ({
  product,
  editable = false, // default to false for order details page
  isUpdating = false,
  isRemoving = false,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  if (!product) return null;

  const isBusy = isUpdating || isRemoving;

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
            {editable && (
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onDecrement}
                  disabled={isBusy || product.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onIncrement}
                  disabled={isBusy}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onRemove}
                  disabled={isBusy}
                >
                  {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
          <div className="font-afacad_semibold text-sm sm:text-xl text-primary sm:text-right flex-shrink-0">
            {isUpdating ? (
              <Loader2 className="h-5 w-5 animate-spin ml-auto" />
            ) : (
              <>
                <div>PHP {Number(product.price || 0).toFixed(2)}</div>
                {editable && (
                  <div className="text-xs sm:text-sm text-neutral-500 font-afacad">
                    Line: PHP {(Number(product.price || 0) * product.quantity).toFixed(2)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsItem;
