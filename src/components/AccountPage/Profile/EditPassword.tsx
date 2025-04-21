import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";

const EditPassword = ({password}: EditAccountProps) => {
    const [isEdit, setIsEdit] = useState(false);
    return (
        <div className="mt-10">
            {!isEdit ? (
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-base">
                            <h1 className="text-[#6B7280]">Password</h1>
                            <h1 className="font-poppins_medium">
                                {Array(password?.length).fill('•').join('')}
                            </h1>
                        </div>
                        <Button
                            onClick={() => setIsEdit(true)}
                            className="bg-transparent border border-[#D2D6DA] shadow-none text-[#6B7280] px-10 py-5"
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
                                type="password"
                                placeholder="Old Password"
                                className="w-1/2 shadow-none h-10"
                            />
                            <Input
                                type="password"
                                placeholder="New Password"
                                className="w-1/2 shadow-none h-10"
                            />
                            <Input
                                type="password"
                                placeholder="Confrim New Password"
                                className="w-1/2 shadow-none h-10"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setIsEdit(false);
                                toast("Profile Changed", {
                                    description:
                                        "New password is set to the account",
                                    className: "bg-green-600/80 border border-none text-white"
                                });
                            }}
                            className="bg-[#778768] shadow-none text-white px-10 py-5"
                        >
                            DONE
                        </Button>
                    </div>
                    <hr className="mt-6" />
                </div>
            )}
        </div>
    );
};

export default EditPassword;
