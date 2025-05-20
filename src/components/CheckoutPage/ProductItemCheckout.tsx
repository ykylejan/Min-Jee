import React from "react";

interface ProductItemCheckoutProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
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
    <div className="bg-white border border-[#D2D6DA] w-auto rounded-lg flex justify-between items-center p-3 my-3 font-afacad">
      <div className="flex items-center">
        <img
          src={image}
          alt="product-item"
          className="aspect-square h-[70px] rounded-md"
        />
        <div className="pl-5">
          <p className="text-gray-500 text-sm">Rental</p>
          <h1 className="font-afacad_medium text-xl">{name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={onDecrease}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-3">{quantity}</span>
              <button
                onClick={onIncrease}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              className="ml-4 text-gray-500 hover:text-gray-700"
              onClick={onRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-medium">
          PHP{" "}
          {(typeof price === "number" ? price : Number(price || 0)).toFixed(2)}
        </h1>
      </div>
    </div>
  );
};

export default ProductItemCheckout;
