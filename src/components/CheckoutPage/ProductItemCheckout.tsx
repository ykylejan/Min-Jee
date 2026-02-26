import { on } from "events";
import React from "react";

interface ProductItemCheckoutProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

const ProductItemCheckout: React.FC<ProductItemCheckoutProps> = ({
  name,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="bg-white border border-[#D2D6DA] w-full rounded-lg flex flex-col sm:flex-row justify-between sm:items-center p-2 sm:p-3 font-afacad gap-2 sm:gap-0">
      <div className="flex items-center min-w-0">
        <img
          src={image}
          alt="product-item"
          className="aspect-square h-[50px] sm:h-[60px] md:h-[70px] rounded-md flex-shrink-0"
        />
        <div className="pl-3 sm:pl-5 min-w-0 flex-1">
          <p className="text-gray-500 text-xs sm:text-sm">Rental</p>
          <h1 className="font-afacad_medium text-base sm:text-lg md:text-xl truncate">{name}</h1>

          {!onIncrease && !onDecrease && !onRemove && (
            <span className="px-2 sm:px-3 text-sm sm:text-base">Quantity: {quantity}</span>
          )}
          {onDecrease && onIncrease && onRemove && (
            <div className="flex items-center mt-1 sm:mt-2 flex-wrap gap-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={onDecrease}
                  className="px-2 py-0.5 sm:py-1 text-gray-600 hover:bg-gray-100 rounded-l-md text-sm sm:text-base"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-2 sm:px-3 text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={onIncrease}
                  className="px-2 py-0.5 sm:py-1 text-gray-600 hover:bg-gray-100 rounded-r-md text-sm sm:text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="ml-2 sm:ml-4 text-gray-500 hover:text-gray-700 text-sm sm:text-base"
                onClick={onRemove}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 self-end sm:self-auto">
        <h1 className="font-medium text-sm sm:text-base whitespace-nowrap">
          PHP{" "}
          {(typeof price === "number" ? price : Number(price || 0)).toFixed(2)}
        </h1>
      </div>
    </div>
  );
};

export default ProductItemCheckout;
