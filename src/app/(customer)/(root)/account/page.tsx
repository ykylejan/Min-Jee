"use client";

import React, { useState } from "react";
import ProfileScreen from "@/components/AccountPage/ProfileScreen";
import OrdersScreen from "@/components/AccountPage/OrdersScreen";

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
                    <h1 className="underline hover:cursor-pointer">Logout</h1>
                </div>

                {isScreen === "Profile" ? (
                    <ProfileScreen />
                ) : isScreen === "Orders" ? (
                    <OrdersScreen />
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
