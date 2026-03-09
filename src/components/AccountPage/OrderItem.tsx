import React from "react";
import StatusLabel from "../StatusLabel";

const OrderItem = ({ name, date, address, children, onClick }: OrderItemProps) => {
    return (
        <div onClick={onClick} className="border border-[#D2D6DA] w-full h-fit rounded-lg px-4 sm:px-10 py-5 hover:bg-neutral-200 cursor-pointer mb-4">
            <div className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                    <h1 className="font-afacad_semibold text-lg truncate">
                        {name}
                    </h1>
                    <h1 className="font-afacad text-base text-[#6B7280]">
                        Order Date: {date}
                    </h1>
                    <h1 className="font-afacad text-base text-[#6B7280] max-w-32 sm:max-w-none truncate">
                        {address}
                    </h1>
                </div>

                <div className="shrink-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
