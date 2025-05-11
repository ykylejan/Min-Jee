import { images } from "@/constants";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProductDetailsItem = () => {
    return (
        <div>
            <div className="flex justify-between mt-5 px-5">
                <div className="flex">
                    <Image
                        src={images.halfsizedFoodWarmer.src}
                        alt="image"
                        width={75}
                        height={75}
                        className="rounded-lg"
                    />

                    <div className="ml-7">
                        <div className="font-afacad_semibold text-xl">
                            Half-Sized Food Warmer
                        </div>
                        <div className="font-afacad text-base text-neutral-500">
                            Rental
                        </div>
                        <div className="font-afacad text-base text-neutral-500">
                            Qty 1
                        </div>
                    </div>
                </div>

                <div className="font-afacad">
                    <div className="font-afacad_medium text-xl">PHP 10.00</div>
                    <div className="underline cursor-pointer flex justify-end text-neutral-600 hover:text-camouflage-400">Edit</div>
                    <div className="cursor-pointer flex justify-end text-red-400 hover:text-red-700">
                        <Trash size={16}/>
                    </div>
                </div>
            </div>

            <hr className="w-full mt-3" />
        </div>
    );
};

export default ProductDetailsItem;
