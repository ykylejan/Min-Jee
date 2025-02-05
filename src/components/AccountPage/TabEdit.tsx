import React from "react";
import { Button } from "../ui/button";

interface TabEditProps {
    label: string;
    sublabel: string;
}

const TabEdit = ({ label, sublabel }: TabEditProps) => {
    return (
        <div>
            <div className="flex items-center justify-between mt-10">
                <div className="text-base">
                    <h1 className="text-[#6B7280]">{label}</h1>
                    <h1 className="font-poppins_medium">{sublabel}</h1>
                </div>
                <Button className="bg-transparent border border-[#D2D6DA] shadow-none text-[#6B7280] px-10 py-5">
                    EDIT
                </Button>
            </div>
            <hr className="mt-6" />
        </div>
    );
};

export default TabEdit;
