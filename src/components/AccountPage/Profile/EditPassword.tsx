import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
// import { updatePassword } from "@/redux/slices/apiSlice";
import { changePassword } from "@/redux/slices/apiSlice";

const EditPassword = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required", {
        className: "bg-yellow-500/80 border border-none text-white",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", {
        className: "bg-red-500/80 border border-none text-white",
      });
      return;
    }

    try {
      await dispatch(
        changePassword({
          password: oldPassword,
          new_password: newPassword,
          conf_password: confirmPassword,
        })
      ).unwrap(); // Unwrap to handle errors directly
      toast.success("Password updated successfully", {
        className: "bg-green-500/80 border border-none text-white",
      });
      setIsEdit(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error || "Failed to update password", {
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
              <h1 className="text-[#6B7280]">Password</h1>
              <h1 className="font-poppins_medium">********</h1>
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
          <div className="flex flex-col space-y-4">
            <Input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-1/2 shadow-none h-10"
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-1/2 shadow-none h-10"
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-1/2 shadow-none h-10"
            />
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <Button
              onClick={handleSave}
              className="bg-camouflage-400 hover:bg-camouflage-400/80 shadow-none text-white px-10 py-5"
            >
              DONE
            </Button>
            <span
              onClick={() => {
                setIsEdit(false);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="text-xs cursor-pointer underline text-gray-500"
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

export default EditPassword;
