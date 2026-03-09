import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";

const EditEmail = ({ email }: EditAccountProps) => {
    const [isEdit, setIsEdit] = useState(false);
    return (
        <div className="mt-10">
            {!isEdit ? (
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-base">
                            <h1 className="text-[#6B7280]">Email</h1>
                            <h1 className="font-poppins_medium">{email}</h1>
                        </div>
                        {/* <Button
                            onClick={() => setIsEdit(true)}
                            className="bg-transparent border border-[#D2D6DA] shadow-none text-[#6B7280] px-10 py-5 hover:bg-gray-100 transition-colors duration-200"
                        >
                            EDIT
                        </Button> */}
                    </div>
                    <hr className="mt-6" />
                </div>
            ) : (
                <div>
                    <div className="space-y-2">
                        <h1 className="text-base">Edit your email:</h1>
                        <Input
                            placeholder="arkiart@gmail.com"
                            className="w-full sm:w-1/2 shadow-none h-10"
                        />
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <Button
                            onClick={() => {
                                setIsEdit(false);
                                toast("Profile Changed", {
                                    description:
                                        "New email is set to the account",
                                    className:
                                        "bg-green-500/80 border border-none text-white",
                                });
                            }}
                            className="bg-camouflage-400 hover:bg-camouflage-400/80 shadow-none text-white px-6 sm:px-10 py-2 sm:py-5 text-sm"
                        >
                            DONE
                        </Button>
                        <span
                            onClick={() => setIsEdit(false)}
                            className="text-xs cursor-pointer underline text-gray-500"
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

export default EditEmail;
