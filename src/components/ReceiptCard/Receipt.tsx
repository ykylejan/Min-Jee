import React from "react";
import ReceiptItem from "./ReceiptItem";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { images } from "@/constants";

const Receipt = ({ data }: any) => {
    // console.log("data: ", data)
    // console.log("customer name: ", data.customerName)

    return (
        <div className="">
            <div className="bg-white border border-[##D2D6DA] w-[750px] h-auto rounded-lg px-24 py-20">
                <h1 className="text-[#6B7280] font-afacad_bold">
                    Order Successful
                </h1>
                <h1 className="font-poppins_extrabold text-5xl py-3">
                    Thanks for booking
                </h1>
                <h1 className="text-[#6B7280] font-afacad pb-8">
                    We appreciate your order, we are currently processing it.
                    Hang on tight and we’ll send you confirmation soon!
                </h1>
                <hr />

                <ReceiptItem />
                <ReceiptItem />

                <div className="font-afacad py-8 space-y-2">
                    <h1 className="flex justify-between">
                        <span className="text-[#6B7280] font-afacad_bold">
                            Subtotal
                        </span>
                        <span className="font-afacad_semibold">PHP 100 </span>
                    </h1>
                    <h1 className="flex justify-between">
                        <span className="text-[#6B7280] font-afacad_bold">
                            Delivery Fee
                        </span>
                        <span className="font-afacad_semibold">PHP 200 </span>
                    </h1>
                    <h1 className="flex justify-between">
                        <span className="text-[#6B7280] font-afacad_bold">
                            Taxes
                        </span>
                        <span className="font-afacad_semibold">PHP 0.00</span>
                    </h1>
                </div>
                <hr />

                <div className="py-8">
                    <h1 className="flex justify-between font-afacad_semibold">
                        <span>TOTAL</span>
                        <span>PHP 200.00</span>
                    </h1>
                </div>
                <hr />

                <div className="py-8">
                    <div className="flex space-x-20">
                        <div className="grid grid-cols-1 gap-4 w-[300px]">
                            <h1 className="font-afacad_semibold">
                                Customer Details
                            </h1>
                            <div className="font-afacad text-[#6B7280]">
                                <h1>Art Montebon </h1>
                                <h1>arkiart@gmail.com</h1>
                                <h1>+63 909-509-5019</h1>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 w-[300px]">
                            <h1 className="font-afacad_semibold">
                                Shipping Address
                            </h1>
                            <div className="font-afacad text-[#6B7280]">
                                <h1>03 Red Stone Calinan</h1>
                                <h1>Davao City</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="py-8">
                    <div className="flex space-x-20">
                        <div className="grid grid-cols-1 gap-4 w-[300px]">
                            <h1 className="font-afacad_semibold">
                                Payment Details
                            </h1>
                            <div className="font-afacad text-[#6B7280]">
                                <h1>Ref No. 1115 8615 6</h1>
                                <h1>20 May 2025</h1>
                                <h1>Amount: PHP 500.00</h1>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 w-[300px]">
                            <h1 className="font-afacad_semibold">Status</h1>
                            <div className="font-afacad text-[#6B7280]">
                                <h1>Partial Payment</h1>
                                <h1>Verified</h1>
                                <Dialog>
                                    <DialogTrigger>
                                        <h1 className="underline">
                                            Receipt.png
                                        </h1>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Payment Receipt
                                            </DialogTitle>
                                            <DialogDescription className="max-h-[70vh] overflow-y-auto">
                                                <img
                                                    src={images.receiptSample.src}
                                                    alt="Receipt"
                                                    className="h-auto w-auto object-cover"
                                                />
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="py-8">
                    <div className="grid grid-cols-1 gap-4">
                        <h1 className="font-afacad_semibold">
                            Shipping Method
                        </h1>
                        <h1 className="font-afacad text-[#6B7280]">
                            Standard Shipping
                        </h1>
                    </div>
                </div>
                <hr />

                <div className="py-8">
                    <div className="flex space-x-20">
                        <div className="grid grid-cols-1 gap-4 w-[300px]">
                            <h1 className="font-afacad_semibold">
                                Date of Use
                            </h1>
                            <h1 className="font-afacad text-[#6B7280]">
                                Jan. 08, 2025
                            </h1>
                        </div>
                        <div className="grid grid-cols-1 gap-4 w-[300px]">
                            <h1 className="font-afacad_semibold">
                                Date of Return
                            </h1>
                            <h1 className="font-afacad text-[#6B7280]">
                                Jan. 09, 2025
                            </h1>
                        </div>
                    </div>
                </div>
                <hr />

                <div className="pt-16">
                    <Link href="/shop">
                        <h1 className="font-afacad text-[#6B7280] underline text-end hover:font-afacad_semibold cursor-pointer">
                            Continue Shopping
                        </h1>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
