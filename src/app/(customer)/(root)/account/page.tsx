"use client";

import React, { useState } from "react";
import EditName from "@/components/AccountPage/Profile/EditName";
import EditEmail from "@/components/AccountPage/Profile/EditEmail";
import EditContactNumber from "@/components/AccountPage/Profile/EditContactNumber";
import EditPassword from "@/components/AccountPage/Profile/EditPassword";
import EditBillingAddress from "@/components/AccountPage/Profile/EditBillingAddress";
import { Button } from "@/components/ui/button";

const page = () => {
    const [isScreen, setIsScreen] = useState("Profile");

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-[80px] px-48">
            <h1 className="text-2xl font-intermedium py-2">Account</h1>

            <div className="bg-white border border-[#D2D6DA] w-full h-auto rounded-lg p-14 flex">
                <div className="font-poppins space-y-8 pr-48">
                    <h1
                        onClick={() => setIsScreen("Profile")}
                        className={`hover:cursor-pointer ${
                            isScreen == "Profile" ? "font-poppins_bold" : ""
                        }`}
                    >
                        Profile
                    </h1>
                    <h1
                        onClick={() => setIsScreen("Orders")}
                        className={`hover:cursor-pointer ${
                            isScreen == "Orders" ? "font-poppins_bold" : ""
                        }`}
                    >
                        Orders
                    </h1>
                    <h1
                        onClick={() => setIsScreen("Events")}
                        className={`hover:cursor-pointer ${
                            isScreen == "Events" ? "font-poppins_bold" : ""
                        }`}
                    >
                        Events
                    </h1>
                    <h1>Logout</h1>
                </div>

                {isScreen === "Profile" ? (
                    <div className="font-afacad text-2xl">
                        <h1 className="font-afacad_medium">Profile</h1>
                        <p className="text-[#6B7280] text-base mb-10">
                            View and update your profile information, including
                            your name, email, and phone number. You can also
                            update your billing address, or change your
                            password.
                        </p>

                        <EditName />
                        <EditEmail />
                        <EditContactNumber />
                        <EditPassword />
                        <EditBillingAddress />
                    </div>
                ) : isScreen === "Orders" ? (
                    <div className="font-afacad text-2xl">
                        <h1 className="font-afacad_medium">Orders</h1>
                        <p className="text-[#6B7280] text-base mb-10">
                            View your previous and current orders. You can also
                            create returns or cancel your orders if needed.
                        </p>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="font-poppins_medium text-base mb-5">
                                Nothing to see here
                            </h1>
                            <h1 className="text-[#6B7280] font-afacad text-base mb-10">
                                Nothing to see here yet. Let us change that :)
                            </h1>
                            <Button className="bg-[#0F172A] font-poppins_medium text-xs h-12 w-48 rounded-full mb-16">
                                Browse Catalog
                            </Button>
                        </div>
                        <hr />
                    </div>
                ) : isScreen === "Events" ? (
                    <div className="">events</div>
                ) : isScreen === "Logout" ? (
                    <div className="">orders</div>
                ) : (
                    <div className="">nothing</div>
                )}
            </div>
        </div>
    );
};

export default page;
