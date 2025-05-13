import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks"; // Import the typed dispatch
import { updateUserInfo } from "@/redux/slices/apiSlice";

interface EditAccountProps {
  contactNumber: string;
}

const EditContactNumber = ({ contactNumber }: EditAccountProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newContactNumber, setNewContactNumber] = useState(contactNumber);
  const dispatch = useAppDispatch(); // Use the typed dispatch

  const handleSave = async () => {
    if (!newContactNumber.trim()) {
      toast.error("Contact number cannot be empty", {
        className: "bg-yellow-500/80 border border-none text-white",
      });
      return;
    }

    try {
      await dispatch(
        updateUserInfo({
          contact_number: newContactNumber,
        })
      ).unwrap(); // Unwrap to handle errors directly
      toast.success("Profile Changed", {
        description: "New contact number is set to the account",
        className: "bg-green-500/80 border border-none text-white",
      });
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error || "Failed to update contact number", {
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
              <h1 className="text-[#6B7280]">Contact Number</h1>
              <h1 className="font-poppins_medium">{newContactNumber}</h1>
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
              <h1 className="text-base">Edit your contact number:</h1>
              <Input
                placeholder="Enter contact number"
                className="w-1/2 shadow-none h-10"
                value={newContactNumber}
                onChange={(e) => setNewContactNumber(e.target.value)}
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
                setNewContactNumber(contactNumber);
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

export default EditContactNumber;