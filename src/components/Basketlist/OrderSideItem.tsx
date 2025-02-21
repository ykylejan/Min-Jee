import React from 'react'

const OrderSideItem = ({ name, category, quantity, price, image }: OrderSideItemProps) => {
    return (
        <div>
            <div className="flex">
                <img src={image} className="w-20 h-20 rounded-lg object-cover"/>

                <div className="px-3 w-full">
                    <div className="flex justify-between items-center">
                        <div className="text-base">
                            <h1 className="font-afacad_semibold">
                                {name}
                            </h1>
                            <h1 className="font-afacad text-neutral-500">
                                {category}
                            </h1>
                        </div>
                        <h1 className="font-afacad underline text-sm text-neutral-500 hover:text-black cursor-pointer">
                            Remove
                        </h1>
                    </div>

                    <div className="flex justify-between font-afacad text-base mt-3 ">
                        <h1 className="text-neutral-500">
                            Qty {quantity}
                        </h1>
                        <h1 className="text-black">PHP {price.toFixed(2)}</h1>
                    </div>
                </div>
            </div>
            <hr className='my-3'/>
        </div>
    )
}

export default OrderSideItem