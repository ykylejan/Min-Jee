"use client";

import React from "react";
import EditName from "@/components/AccountPage/Profile/EditName";
import EditEmail from "@/components/AccountPage/Profile/EditEmail";
import EditContactNumber from "@/components/AccountPage/Profile/EditContactNumber";
import EditPassword from "@/components/AccountPage/Profile/EditPassword";
import EditBillingAddress from "@/components/AccountPage/Profile/EditBillingAddress";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-[80px] px-48">
            <h1 className="text-2xl font-intermedium py-2">Account</h1>

            <div className="bg-white border border-[#D2D6DA] w-full h-auto rounded-lg p-14 flex">
                <div className="font-poppins space-y-8 pr-48">
                    <h1>Profile</h1>
                    <h1>Orders</h1>
                    <h1>Events</h1>
                    <h1>Logout</h1>
                </div>

                <div className="font-afacad text-2xl">
                    <h1 className="font-afacad_medium">Profile</h1>
                    <p className="text-[#6B7280] text-base mb-10">
                        View and update your profile information, including your
                        name, email, and phone number. You can also update your
                        billing address, or change your password.
                    </p>

                    <EditName />
                    <EditEmail />
                    <EditContactNumber />
                    <EditPassword />
                    <EditBillingAddress />
                </div>
            </div>
        </div>
    );
};

export default page;
