import { icons, images } from "@/constants";
import { Download } from "lucide-react";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PaymentDetailsItem = () => {
    return (
        <div className="w-80 h-40 border border-neutral-200 rounded-lg font-afacad text-neutral-600 px-8 py-5 mt-5">
            <h1 className="font-afacad_semibold text-xl">GCash</h1>

            <div className="-space-y-2">
                <h1>Art Montebon</h1>
                <h1>Ref No: 1039SD9898OIN</h1>
            </div>

            <div className="flex justify-between mt-3">
                <div className="flex items-center gap-x-3">
                    <Download width={16} height={16} />
                    <Dialog>
                        <DialogTrigger>
                            <h1 className="underline">Receipt.png</h1>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Payment Receipt</DialogTitle>
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

                <img src={icons.gcashActive.src} width={30} height={25} />
            </div>
        </div>
    );
};

export default PaymentDetailsItem;
