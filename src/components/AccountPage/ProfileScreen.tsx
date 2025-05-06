import React from "react";
import EditName from "./Profile/EditName";
import EditEmail from "./Profile/EditEmail";
import EditContactNumber from "./Profile/EditContactNumber";
import EditPassword from "./Profile/EditPassword";
import EditAddress from "./Profile/EditAddress";

const ProfileScreen = () => {
    return (
        <div className="font-afacad text-2xl">
            <h1 className="font-afacad_medium">Profile</h1>
            <p className="text-[#6B7280] text-base mb-10">
                View and update your profile information, including your name,
                email, and phone number. You can also update your billing
                address, or change your password.
            </p>

            <div>
                <EditName firstname={"Art"} lastname={"Montebon"} />
                <EditEmail email={"arkiart@gmail.com"} />
                <EditContactNumber contactNumber={"09963355454"} />
                <EditPassword password={"Test123!"} />
                <EditAddress address={"33 Red Stone, Calinan"} />
            </div>


        </div>
    );
};

export default ProfileScreen;
