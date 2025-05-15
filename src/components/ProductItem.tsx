import Image from "next/image";
import React from "react";

const ProductItem = ({ image, name, price, className }: ProductProps) => {
  return (
    <div className="hover:cursor-pointer relative overflow-hidden rounded-md">
      <div className="relative">
        {/* <img
                    src={image.src}
                    alt="product_image"
                    className={`aspect-square rounded-md mb-3 transition-transform duration-300 hover:scale-105 object-cover ${className}`}
                /> */}
        <img
          src={image}
          alt={name}
          className={`w-[300px] h-[300px] rounded-md mb-3 transition-transform duration-300 hover:scale-105 object-cover ${className}`}
        />
        {/* <Image
                    src={image}
                    alt="image"
                    width={500}
                    height={500}
                    className={`aspect-square rounded-md mb-3 transition-transform duration-300 hover:scale-105 object-cover ${className}`}
                /> */}
        <div className="absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-md"></div>
      </div>
      <h1 className="text-lg font-afacad_medium">{name}</h1>
      <h1 className="text-base font-afacad text-black/70">
        {price}
      </h1>
    </div>
  );
};

export default ProductItem;
