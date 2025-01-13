import Link from "next/link";
import React from "react";

const ProductItem = ({
    image = "/placeholderProduct.png",
    name = "Half-Sized Food Warmer",
    price = "PHP 8.00 - per day",
}) => {
    return (
        <Link href="/product-item">
            <div className="w-72 lg:w-64 hover:cursor-pointer relative overflow-hidden rounded-md">
                <div className="relative">
                    <img
                        src={image}
                        alt="product_image"
                        className="aspect-square rounded-md mb-3 transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-md"></div>
                </div>
                <h1 className="text-xl font-afacad_medium">{name}</h1>
                <h1 className="text-md font-afacad">{price}</h1>
            </div>
        </Link>
    );
};

export default ProductItem;
