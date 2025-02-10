import React from "react";
import StatusLabel from "../StatusLabel";

const OrderItem = ({ name, date, address, children  }: OrderItemProps) => {
    return (
        <div className="border border-[#D2D6DA] w-full h-28 rounded-lg px-10 py-5 hover:bg-neutral-200 cursor-pointer mb-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="font-afacad_semibold text-lg">
                        {name}
                    </h1>
                    <h1 className="font-afacad text-base text-[#6B7280]">
                        Order Date: {date}
                    </h1>
                    <h1 className="font-afacad text-base text-[#6B7280]">
                        {address}
                    </h1>
                </div>

                {children}
            </div>
        </div>
    );
};

export default OrderItem;
