import Image from "next/image";
import React from "react";

const ProductItem = ({ image, name, price, className }: ProductProps) => {
  return (
    <div className="hover:cursor-pointer relative overflow-hidden rounded-md">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className={`w-full aspect-square rounded-md mb-2 md:mb-3 transition-transform duration-300 hover:scale-105 object-cover ${className}`}
        />
        <div className="absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-md"></div>
      </div>
      <h1 className="text-base md:text-lg font-afacad_medium line-clamp-2">{name}</h1>
      <h1 className="text-sm md:text-base font-afacad text-black/70">
        {price}
      </h1>
    </div>
  );
};

export default ProductItem;
