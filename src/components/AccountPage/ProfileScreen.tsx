import React from "react";
import EditName from "./Profile/EditName";
import EditEmail from "./Profile/EditEmail";
import EditContactNumber from "./Profile/EditContactNumber";
import EditPassword from "./Profile/EditPassword";
import EditBillingAddress from "./Profile/EditBillingAddress";
import { AccountSample } from "@/constants";

const ProfileScreen = () => {
    return (
        <div className="font-afacad text-2xl">
            <h1 className="font-afacad_medium">Profile</h1>
            <p className="text-[#6B7280] text-base mb-10">
                View and update your profile information, including your name,
                email, and phone number. You can also update your billing
                address, or change your password.
            </p>

            {AccountSample.map((sample) => (
                <div key={sample.id}>
                    <EditName firstname={sample.firstName} lastname={sample.lastName} />
                    <EditEmail email={sample.email} />
                    <EditContactNumber contactNumber={sample.contactNumber} />
                    <EditPassword password={sample.password} />
                    <EditBillingAddress address={sample.address} />
                </div>
            ))}
        </div>
    );
};

export default ProfileScreen;
