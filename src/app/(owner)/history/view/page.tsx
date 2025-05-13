"use client";

import Receipt from "@/components/ReceiptCard/Receipt";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
    const router = useRouter();
    return (
        <div className="flex justify-center">
            <div className="flex flex-col px-4 md:px-6">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors -ml-2"
                    >
                        <MoveLeft
                            width={20}
                            height={20}
                            className="text-neutral-600"
                        />
                    </button>
                </div>

                <div className="w-full">
                    <Receipt />
                </div>
            </div>
        </div>
    );
};

export default page;
