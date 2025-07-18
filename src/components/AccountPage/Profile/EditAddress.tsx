import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks"; // Import the typed dispatch
import { updateUserInfo } from "@/redux/slices/apiSlice";

interface EditAccountProps {
  address: string;
}

const EditAddress = ({ address }: EditAccountProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newAddress, setNewAddress] = useState(address);
  const dispatch = useAppDispatch(); // Use the typed dispatch

  const handleSave = async () => {
    if (!newAddress.trim()) {
      toast.error("Address cannot be empty", {
        className: "bg-yellow-500/80 border border-none text-white",
      });
      return;
    }

    try {
      await dispatch(
        updateUserInfo({
          address: newAddress,
        })
      ).unwrap(); // Unwrap to handle errors directly
      toast.success("Profile Changed", {
        description: "New address is set to the account",
        className: "bg-green-500/80 border border-none text-white",
      });
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error || "Failed to update address", {
        className: "bg-red-500/80 border border-none text-white",
      });
    }
  };

  return (
    <div className="mt-10">
      {!isEdit ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-base">
              <h1 className="text-[#6B7280]">Home Address</h1>
              <h1 className="font-poppins_medium">{newAddress}</h1>
            </div>
            <Button
              onClick={() => setIsEdit(true)}
              className="bg-transparent border border-[#D2D6DA] shadow-none text-[#6B7280] px-10 py-5 hover:bg-gray-100 transition-colors duration-200"
            >
              EDIT
            </Button>
          </div>
          <hr className="mt-6" />
        </div>
      ) : (
        <div className="">
          <div className="flex justify-between items-center">
            <div className="w-full space-y-2">
              <h1 className="text-base">Edit your address:</h1>
              <Textarea
                placeholder="03 Red Stone, Calinan, Davao City.."
                className="w-1/2 shadow-none h-10"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSave}
              className="bg-camouflage-400 hover:bg-camouflage-400/80 shadow-none text-white px-10 py-5"
            >
              DONE
            </Button>

            <span
              onClick={() => {
                setIsEdit(false);
                setNewAddress(address);
              }}
              className="text-xs cursor-pointer underline ml-4 text-gray-500"
            >
              Cancel
            </span>
          </div>
          <hr className="mt-6" />
        </div>
      )}
    </div>
  );
};

export default EditAddress;
