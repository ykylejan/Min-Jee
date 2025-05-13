import React, { useState, useRef } from "react";
import { FcInfo } from "react-icons/fc";
import { IoIosCheckmark } from "react-icons/io";
import PaymentButtons from "./Payment Details/PaymentButtons";
import PaymentProcess from "./Payment Details/PaymentProcess";
import { FaTruckFast } from "react-icons/fa6";
import { icons, images } from "@/constants";
import { Check, ScanQrCode, Upload, X } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

const OrderDetailsPayment = () => {
    const [paymentOption, setPaymentOption] = useState("GCash");
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceiptFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmPayment = () => {
        if (receiptFile) {
            setPaymentConfirmed(true);
            setDialogOpen(false);
        } else {
            alert("Please upload a receipt first.");
        }
    };

    const handleClearReceipt = (e) => {
        e.stopPropagation();
        setReceiptFile(null);
        setReceiptPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div>
            <hr className="my-3" />
            <div className="flex items-center">
                <IoIosCheckmark color="transparent" size={40} />
                <h1 className="text-2xl font-afacad_medium">Payment Details</h1>
            </div>

            <div className="bg-[#EFF6FF] w-full h-10 rounded-md flex items-center px-5 mt-2 mb-5">
                <FcInfo size={20} />
                <h1 className="text-[#2196F3] font-afacad pl-5">
                    Choose your payment option
                </h1>
            </div>

            <div className="flex gap-x-4 mb-8">
                <div onClick={() => setPaymentOption("GCash")}>
                    <PaymentButtons
                        text="GCash"
                        image={icons.gcash.src}
                        imageActive={icons.gcashActive.src}
                        isActive={paymentOption === "GCash"}
                    />
                </div>
                <div onClick={() => setPaymentOption("COD")}>
                    <PaymentButtons
                        text="Cash on Delivery"
                        image={icons.wallet.src}
                        imageActive={icons.walletActive.src}
                        isActive={paymentOption === "COD"}
                    />
                </div>
            </div>

            {paymentOption === "GCash" && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="w-full text-start">
                        <PaymentProcess
                            text="GCash Selected"
                            image={icons.gcashActive.src}
                            description={paymentConfirmed ? `Receipt: ${receiptFile?.name || "receipt.png"}` : "Click to scan the QR code"}
                            icon={paymentConfirmed ? 
                                <Check color="#22C55E" size={35} /> : 
                                <ScanQrCode color="#6B7280" size={35} />
                            }
                            isGcash="GCash"
                        />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0">
                        <DialogHeader className="">
                            <DialogTitle className="sr-only">
                                GCash Payment
                            </DialogTitle>
                        </DialogHeader>
                        {/* GCash header */}
                        <div className="bg-[#0066DF] text-white text-center py-4 px-6">
                            <div className="flex justify-between items-center">
                                <div className="flex-1 flex justify-center">
                                    <h2 className="text-2xl font-bold">
                                        GCash Payment
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Payment content */}
                        <div className="bg-white p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left side - QR code */}
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-white border-2 border-[#0066DF] rounded-md p-3 w-full max-w-xs">
                                        <div className="text-center mb-2 text-[#0066DF] font-medium">
                                            Scan the QR code to pay
                                        </div>
                                        <div className="bg-[#E6F2FF] p-4 rounded-md flex justify-center items-center">
                                            <img
                                                src={images.qrCodeSample.src}
                                                alt="QR Code"
                                                className="w-full h-auto max-w-[200px]"
                                            />
                                        </div>
                                        <div className="text-center mt-3 text-[#0066DF] font-semibold">
                                            SCAN TO PAY
                                        </div>
                                        <div className="text-center mt-2 bg-[#0066DF] text-white py-2 rounded-md">
                                            Amount: ₱ 500.00
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Instructions and upload */}
                                <div className="flex flex-col">
                                    <div className="bg-[#E6F2FF] p-4 rounded-md mb-4">
                                        <h3 className="text-[#0066DF] font-bold mb-2">
                                            Payment Instructions
                                        </h3>
                                        <ol className="list-decimal pl-5 text-[#0066DF]">
                                            <li className="mb-1">
                                                Open your GCash app
                                            </li>
                                            <li className="mb-1">
                                                Tap on "Scan QR"
                                            </li>
                                            <li className="mb-1">
                                                Point your camera to the QR code
                                            </li>
                                            <li className="mb-1">
                                                Confirm the payment
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-[#0066DF] font-bold mb-2">
                                            Upload Receipt
                                        </h3>
                                        {receiptPreview ? (
                                            <div className="border-2 border-[#0066DF] rounded-md p-2 text-center relative">
                                                <button 
                                                    onClick={handleClearReceipt}
                                                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1"
                                                    type="button"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-full pb-2 overflow-hidden">
                                                        <img 
                                                            src={receiptPreview} 
                                                            alt="Receipt Preview" 
                                                            className="max-h-40 max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-[#0066DF] font-medium truncate max-w-full">
                                                        {receiptFile.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-[#0066DF] rounded-md p-4 text-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="gcash-receipt"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                />
                                                <label
                                                    htmlFor="gcash-receipt"
                                                    className="cursor-pointer block w-full"
                                                >
                                                    <div className="flex flex-col items-center justify-center py-3">
                                                        <Upload size={36} color="#0066DF" />
                                                        <span className="mt-2 text-[#0066DF] font-medium">
                                                            Choose file or drag &
                                                            drop
                                                        </span>
                                                        <span className="mt-1 text-sm text-[#0066DF]/70">
                                                            JPEG, PNG or PDF (max.
                                                            5MB)
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        className={`mt-6 ${
                                            receiptFile ? 'bg-[#0066DF] hover:bg-[#0055c8]' : 'bg-gray-400 cursor-not-allowed'
                                        } text-white font-bold py-3 px-6 rounded-md w-full transition-colors`}
                                        onClick={handleConfirmPayment}
                                        disabled={!receiptFile}
                                    >
                                        Confirm Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {paymentOption === "COD" && (
                <PaymentProcess
                    text="Cash on delivery Selected"
                    image={icons.walletActive.src}
                    description="Payment will be done onsite"
                    icon={<FaTruckFast color="#6B7280" size={35} />}
                    isGcash="COD"
                />
            )}
            <hr className="mt-5" />
        </div>
    );
};

export default OrderDetailsPayment;