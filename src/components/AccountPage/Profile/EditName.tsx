import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
// import { useDispatch } from "react-redux";
import { useAppDispatch } from "@/redux/hooks";
import { updateUserInfo } from "@/redux/slices/apiSlice";

interface EditAccountProps {
  firstname: string;
  lastname: string;
}

const EditName = ({ firstname, lastname }: EditAccountProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newFirstName, setNewFirstName] = useState(firstname);
  const [newLastName, setNewLastName] = useState(lastname);
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    if (!newFirstName.trim() || !newLastName.trim()) {
      toast.error("All fields are required", {
        className: "bg-yellow-500/80 border border-none text-white",
      });
      return;
    }

    try {
      await dispatch(
        updateUserInfo({
          first_name: newFirstName,
          last_name: newLastName,
        })
      ).unwrap(); // Unwrap to handle errors directly
      toast.success("Profile Changed", {
        description: "New name is set to the account",
        className: "bg-green-500/80 border border-none text-white",
      });
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error || "Failed to update name", {
        className: "bg-red-500/80 border border-none text-white",
      });
    }
  };

  return (
    <div>
      {!isEdit ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-base">
              <h1 className="text-[#6B7280]">Name</h1>
              <h1 className="font-poppins_medium">
                {newFirstName + " " + newLastName}
              </h1>
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
              <h1 className="text-base">Edit your name:</h1>
              <Input
                placeholder="First Name"
                className="w-1/2 shadow-none h-10"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <Input
                placeholder="Last Name"
                className="w-1/2 shadow-none h-10"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
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
                setNewFirstName(firstname);
                setNewLastName(lastname);
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

export default EditName;
