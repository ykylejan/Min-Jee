import React from "react";
import EditName from "./Profile/EditName";
import EditEmail from "./Profile/EditEmail";
import EditContactNumber from "./Profile/EditContactNumber";
import EditPassword from "./Profile/EditPassword";
import EditAddress from "./Profile/EditAddress";
import { Input } from "@/components/ui/input";

interface CustomerData {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  contact_number: string;
  verifyEmail: boolean;
  verifyNumber: boolean;
}

interface ProfileScreenProps {
  customerData: CustomerData;
}

const ProfileScreen = ({ customerData }: ProfileScreenProps) => {
  return (
    <div className="font-afacad text-2xl w-full">
      <h1 className="font-afacad_medium">Profile</h1>
      <p className="text-[#6B7280] text-base mb-10">
        View and update your profile information, including your name, email,
        and phone number. You can also update your billing address, or change
        your password.
      </p>

      <div className="space-y-6">
        <EditName
          firstname={customerData.first_name}
          lastname={customerData.last_name}
        />

        <EditEmail
          email={customerData.email}
          //   verified={customerData.verifyEmail}
        />

        <EditContactNumber
          contactNumber={customerData.contact_number}
          //   verified={customerData.verifyNumber}
        />

        <EditPassword />

        <EditAddress address={customerData.address} />
      </div>
    </div>
  );
};

export default ProfileScreen;
