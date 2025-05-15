import React, { useState } from "react";

interface AddOnProps {
    name: string;
    price: number;
    className?: any;
    selected?: boolean;
    onClick?: () => void;
}

const AddOn = ({ name, price, className, selected, onClick }: AddOnProps) => {
    return (
        <div
            onClick={onClick}
            className={`w-60 h-16 rounded-md border border-neutral-200 bg-white shadow-sm flex items-center cursor-pointer px-5 ${className} ${selected && `border-green-500 bg-green-50`}`}
        >
            <div className={`rounded-full w-4 h-4 border border-neutral-400 ${selected && `bg-green-500 border-green-500`}`} />

            <div className="pl-10">
                <h1 className="font-afacad_medium text-xl">{name} </h1>
                <h1 className="text-xs">PHP {price.toFixed(2)} </h1>
            </div>
        </div>
    );
};

export default AddOn;
