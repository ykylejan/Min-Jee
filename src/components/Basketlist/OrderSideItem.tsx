import React from 'react'

const OrderSideItem = () => {
    return (
        <div>
            <div className="flex">
                <img src="/images/halfsizedFoodWarmer.png" className="w-20 h-20 rounded-lg" />

                <div className="px-3 w-full">
                    <div className="flex justify-between items-center">
                        <div className="text-base">
                            <h1 className="font-afacad_semibold">
                                Half Sized Food Warmer
                            </h1>
                            <h1 className="font-afacad text-neutral-500">
                                Rental
                            </h1>
                        </div>
                        <h1 className="font-afacad underline text-sm text-neutral-500 hover:text-black cursor-pointer">
                            Remove
                        </h1>
                    </div>

                    <div className="flex justify-between font-afacad text-base mt-3 ">
                        <h1 className="text-neutral-500">
                            Qty 1
                        </h1>
                        <h1 className="text-black">PHP 7.00</h1>
                    </div>
                </div>
            </div>
            <hr className='my-3'/>
        </div>
    )
}

export default OrderSideItem