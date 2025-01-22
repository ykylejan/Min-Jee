import React from "react";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const OrderDetails = () => {
    return (
        <div className="bg-white border border-[#D2D6DA] w-[750px] h-auto rounded-lg px-12 pt-6 pb-12">
            <div className="font-afacad">
                <h1 className="text-2xl font-afacad_medium">Order Details</h1>
                <h1 className="text-[#6B7280]">
                    To order for approval, enter the following details
                </h1>
            </div>

            <div className="font-afacad space-y-5">
                <div className="mt-5">
                    <h1>Name</h1>
                    <Input placeholder="John Doe" />
                </div>
                <div>
                    <h1>Location Address</h1>
                    <Input placeholder="03 Red Stone, Calinan, Davao City" />
                </div>
                <div className="flex gap-x-3">
                    <div className="w-1/2">
                        <h1>Date of Rent</h1>
                        <Input placeholder="Enter Date" />
                    </div>
                    <div className="w-1/2">
                        <h1>Time of Rent</h1>
                        <Input placeholder="Enter Date" />
                    </div>
                </div>

                <div className="w-1/2">
                    <h1>Date of Return</h1>
                    <Input placeholder="Enter Date" />
                </div>

                <div className="w-full">
                    <h1>Phone Number</h1>
                    <Input placeholder="909-876-5432" />
                </div>

                <div className="space-y-3 pb-3">
                    <h1>Order Obtainment Method</h1>
                    <RadioGroup
                        defaultValue="option-one"
                        className="flex gap-x-10"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="option-one"
                                id="option-one"
                                className="border border-[#D2D6DA]"
                            />
                            <Label htmlFor="option-one">Pick Up</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="option-two"
                                id="option-two"
                                className="border border-[#D2D6DA]"
                            />
                            <Label htmlFor="option-two">Shipped</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div>
                    <h1>Note to Owner</h1>
                    <Textarea
                        placeholder="Write a note of your order here"
                        className="min-h-[120px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
