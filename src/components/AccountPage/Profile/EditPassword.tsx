import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const EditPassword = ({ password }: EditAccountProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // Validation
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

    setIsEdit(false);
    toast.success("Profile Changed", {
      description: "New password is set to the account",
      className: "bg-green-500/80 border border-none text-white",
    });

    // Optional: Clear fields after save
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="mt-10">
      {!isEdit ? (
        <div>
          <div className="flex items-center justify-between">
            <div className="text-base">
              <h1 className="text-[#6B7280]">Password</h1>
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
        <div>
          <div className="flex justify-between items-start gap-6">
            <div className="w-full space-y-2">
              <h1 className="text-base">Change your password:</h1>

              {/* Current Password */}
              <div className="relative w-1/2">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Current Password"
                  className="w-full shadow-none h-10 pr-10"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative w-1/2">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full shadow-none h-10 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative w-1/2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="w-full shadow-none h-10 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <Button
                onClick={handleSave}
                className="bg-camouflage-400 hover:bg-camouflage-400/80 shadow-none text-white px-10 py-5"
              >
                DONE
              </Button>

              <span
                onClick={() => setIsEdit(false)}
                className="text-xs cursor-pointer underline text-gray-500"
              >
                Cancel
              </span>
            </div>
          </div>
          <hr className="mt-6" />
        </div>
      )}
    </div>
  );
};

export default EditPassword;
