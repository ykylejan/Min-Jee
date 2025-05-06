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


            <div className="font-afacad">
                <div className="pt-8">
                    <div className="flex items-center gap-x-3">
                        {/* <User size={20} /> */}
                        <h1 className="text-xl font-afacad_medium">Personal Information</h1>
                    </div>
                    <hr />

                    <div className="space-y-3">
                        <div className="mt-5">
                            <h1>Name</h1>
                            <Input placeholder="John Doe" />
                        </div>

                        <div>
                            <h1>Location Address</h1>
                            <Input placeholder="03 Red Stone, Calinan, Davao City" />
                        </div>
                    </div>
                </div>


                <div className="pt-16">
                    <div className="flex items-center gap-x-3">
                        {/* <NotebookIcon size={20} /> */}
                        <h1 className="text-xl font-afacad_medium">Booking Schedule</h1>
                    </div>
                    <hr />


                    <div className="space-y-3">
                        <div className="flex gap-x-3 mt-5">
                            <div className="">
                                <h1>Date of Booking</h1>
                                <Input type="date" />
                            </div>
                            <div className="">
                                <h1>Time of Booking</h1>
                                <Input type="time" />
                            </div>
                        </div>

                        <div className="flex items-center gap-x-3 ">
                            <div className="">
                                <h1> Return Date</h1>
                                <Input type="date" />
                            </div>
                            <div className="">
                                <h1>Time of Return</h1>
                                <Input type="time" />
                            </div>
                            <h1 className="text-neutral-500 text-sm">(If rent included)</h1>
                        </div>
                    </div>



                </div>

                <div className="pt-16">
                    <div className="flex items-center gap-x-3">
                        {/* <Truck size={20} /> */}
                        <h1 className="text-xl font-afacad_medium">Delivery Option</h1>
                    </div>
                    <hr />

                    <div className="space-y-3 mt-5">
                        <div className="space-y-2">
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

                        <div className="pt-5">
                            <h1>Note to Owner</h1>
                            <Textarea
                                placeholder="Write a note of your order here"
                                className="min-h-[120px]"
                            />
                        </div>
                    </div>
                </div>



                {/* <div className="pt-6">
                    <Button className="bg-camouflage-400 text-white hover:bg-camouflage-400/80">Submit Order</Button>
                </div> */}


            </div>
        </div>
    );
};

export default OrderDetails;
