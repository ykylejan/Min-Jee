import { Banknote, Timer, TimerReset, Truck } from "lucide-react";
import React from "react";

const OrderDetailsSection = () => {
    return (
        <div className="mt-5 font-afacad text-neutral-600">
            <div className="flex flex-row gap-x-10">
                <div className="space-y-3">
                    <h1 className="flex justify-between gap-x-7">
                        <span>Order Number:</span>
                        <span>REF 10225</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Customer Name:</span>
                        <span>Art Montebon</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Contact Number:</span>
                        <span>09987654321</span>
                    </h1>
                </div>

                <div className="border border-r-0"></div>

                <div className="space-y-3">
                    <h1 className="flex justify-between gap-x-7">
                        <span>Obtainment:</span>
                        <span>Shipped</span>
                    </h1>
                    <h1 className="flex justify-between gap-x-7">
                        <span>Location:</span>
                        <span>03 Red Stone, Calinan</span>
                    </h1>
                </div>
            </div>

            <div className="mt-8 w-fit space-y-3">
                <div className="flex items-center gap-x-2">
                    <Timer width={16} height={16} />
                    <h1 className="flex justify-between gap-x-7">
                        <span>Date of Booking:</span>
                        <span className="font-afacad text-camouflage-500 underline">
                            Dec 21, 2024
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-x-2">
                    <TimerReset width={16} height={16} />
                    <h1 className="flex justify-between gap-x-7">
                        <span>Date of Return:</span>
                        <span className="font-afacad text-camouflage-500 underline">
                            Dec 24, 2024
                        </span>
                    </h1>
                </div>
            </div>

            <div className="mt-8 w-fit space-y-3">
                <div className="flex items-center gap-x-2">
                    <Truck width={16} height={16} />
                    <h1 className="flex justify-between gap-x-7">
                        <span>Delivery Fee:</span>
                        <span className="font-afacad text-camouflage-500 underline">
                            edit
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-x-2">
                    <Banknote width={16} height={16} />
                    <h1 className="flex justify-between gap-x-7">
                        <span>Deposit Fee:</span>
                        <span className="font-afacad text-camouflage-500 underline">
                            edit
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsSection;
