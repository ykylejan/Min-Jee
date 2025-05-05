import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";

const EditContactNumber = ({ contactNumber }: EditAccountProps) => {
    const [isEdit, setIsEdit] = useState(false);
    return (
        <div className="mt-10">
            {!isEdit ? (
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-base">
                            <h1 className="text-[#6B7280]">Contact Number</h1>
                            <h1 className="font-poppins_medium">
                                {contactNumber}
                            </h1>
                        </div>
                        <Button
                            onClick={() => setIsEdit(true)}
                            className="bg-transparent border border-[#D2D6DA] shadow-none text-[#6B7280] px-10 py-5 hover:bg-gray-100 transition-colors duration-200"
                        >
                            EDIT
                        </Button>
                    </div>
                    <hr className="mt-6" />
                </div>
            ) : (
                <div className="">
                    <div className="flex justify-between items-center">
                        <div className="w-full space-y-2">
                            <h1 className="text-base">
                                Edit your contact number:
                            </h1>
                            <Input
                                placeholder="09963355454"
                                className="w-1/2 shadow-none h-10"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setIsEdit(false);
                                toast("Profile Changed", {
                                    description:
                                        "New contact number is set to the account",
                                    className:
                                        "bg-green-500/80 border border-none text-white",
                                });
                            }}
                            className="bg-camouflage-400 hover:bg-camouflage-400/80 shadow-none text-white px-10 py-5"
                        >
                            DONE
                        </Button>

                        <span
                            onClick={() => setIsEdit(false)}
                            className="text-xs cursor-pointer underline ml-4 text-gray-500"
                        >
                            Cancel
                        </span>
                        
                    </div>
                    <hr className="mt-6" />
                </div>
            )}
        </div>
    );
};

export default EditContactNumber;
