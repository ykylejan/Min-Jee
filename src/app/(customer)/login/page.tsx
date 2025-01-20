"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const page = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[80px]">
            <div className="flex flex-col justify-center items-center pt-[80px]">
                <img
                    src="/leaflogo.svg"
                    alt="logo"
                    className="w-24 h-24 sm:w-auto sm:h-auto"
                />
                <h1 className="font-intersemibold text-2xl mt-6 sm:mt-8 text-center">
                    Log in to Min-Jee
                </h1>
                <div className="px-8">
                    <Input
                        placeholder="Email"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-6 sm:mt-8 placeholder:text-[#BDC3C9]"
                    />
                    <div className="relative w-full sm:w-[360px] mt-3">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="bg-white w-full h-[55px] font-inter placeholder:text-[#BDC3C9] pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    <Button className="bg-[#778768] w-full sm:w-[360px] h-[55px] font-bold mt-6 sm:mt-8">
                        CONTINUE
                    </Button>
                </div>

                <h1 className="font-inter text-[13px] mt-16 sm:mt-20 mb-16 sm:mb-28 text-center">
                    <span className="text-[#BDC3C9]">
                        Don't have an account?{" "}
                    </span>
                    <Link href="/signup">
                        <span className="text-[#50A7FF] hover:underline cursor-pointer">
                            Sign up!
                        </span>
                    </Link>
                </h1>
            </div>
        </div>
    );
};

export default page;
