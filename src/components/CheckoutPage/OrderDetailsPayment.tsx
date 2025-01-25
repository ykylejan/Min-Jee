import React, { useState } from "react";
import { FcInfo } from "react-icons/fc";
import { IoIosCheckmark } from "react-icons/io";
import PaymentButtons from "./Payment Details/PaymentButtons";
import PaymentProcess from "./Payment Details/PaymentProcess";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";

const OrderDetailsPayment = () => {
    const [paymentOption, setPaymentOption] = useState("GCash");
    return (
        <div>
            <hr className="my-3" />
            <div className="flex items-center">
                <IoIosCheckmark color="transparent" size={40} />
                <h1 className="text-2xl font-afacad_medium">Payment Details</h1>
            </div>

            <div className="bg-[#EFF6FF] w-full h-10 rounded-md flex items-center px-5 mt-2 mb-11">
                <FcInfo size={20} />
                <h1 className="text-[#2196F3] font-afacad pl-5">
                    Choose your payment option
                </h1>
            </div>

            <div className="flex gap-x-4 mb-8">
                <div onClick={() => setPaymentOption("GCash")}>
                    <PaymentButtons
                        text="GCash"
                        image="/gcash-xl.png"
                        isActive={paymentOption === "GCash"}
                    />
                </div>
                <div onClick={() => setPaymentOption("COD")}>
                    <PaymentButtons
                        text="Cash on Delivery"
                        image="/wallet.png"
                        isActive={paymentOption === "COD"}
                    />
                </div>
            </div>

            {paymentOption === "GCash" && (
                <PaymentProcess
                    text="GCash Selected"
                    image="/gcash-xl.png"
                    description="Upload you GCash receipt here"
                    icon={<MdOutlineUploadFile color="#6B7280" size={35} />}
                />
            )}

            {paymentOption === "COD" && (
                <PaymentProcess
                    text="Cash on delivery Selected"
                    image="/wallet.png"
                    description="Payment will be done onsite"
                    icon={<FaTruckFast color="#6B7280" size={35} />}
                />
            )}
            <hr className="mt-5" />
        </div>
    );
};

export default OrderDetailsPayment;
