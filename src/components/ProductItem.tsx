import Link from "next/link";
import React from "react";

const ProductItem = ({ image, name, price, className }: ProductProps) => {
    return (
        <div className="w-72 lg:w-64 hover:cursor-pointer relative overflow-hidden rounded-md">
            <div className="relative">
                <img
                    src={image.src}
                    alt="product_image"
                    className={`aspect-square rounded-md mb-3 transition-transform duration-300 hover:scale-105 object-cover ${className}`}
                />
                <div className="absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-md"></div>
            </div>
            <h1 className="text-lg font-afacad_medium">{name}</h1>
            <h1 className="text-base font-afacad text-black/70">PHP {price.toFixed(2)}</h1>
        </div>
    );
};

export default ProductItem;
