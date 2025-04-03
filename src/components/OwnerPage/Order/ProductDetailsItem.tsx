import { images } from '@/constants'
import Image from 'next/image'
import React from 'react'

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
                        <div className="font-afacad_semibold text-xl">Half-Sized Food Warmer</div>
                        <div className="font-afacad text-base text-neutral-500">Rental</div>
                        <div className="font-afacad text-base text-neutral-500">Qty 1</div>
                    </div>
                </div>

                <div className="font-afacad_medium text-xl">PHP 10.00</div>
            </div>

            <hr className="w-full mt-3" />
        </div>
    )
}

export default ProductDetailsItem