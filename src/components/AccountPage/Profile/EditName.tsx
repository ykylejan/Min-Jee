import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";

const EditName = () => {
    const [isEdit, setIsEdit] = useState(false);
    return (
        <div>
            {!isEdit ? (
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-base">
                            <h1 className="text-[#6B7280]">Name</h1>
                            <h1 className="font-poppins_medium">
                                Art Montebon
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
                            <h1 className="text-base">Edit your name:</h1>
                            <Input
                                placeholder="First Name"
                                className="w-1/2 shadow-none h-10"
                            />
                            <Input
                                placeholder="Last Name"
                                className="w-1/2 shadow-none h-10"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setIsEdit(false);
                                toast({
                                    variant: "success",
                                    title: "Profile changed!",
                                    description: "New name saved to account",
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

export default EditName;
