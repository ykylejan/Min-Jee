import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { IoIosMailOpen } from "react-icons/io";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[80px]">
            <Navbar />
            <div className="flex flex-col justify-center items-center pt-[80px] pb-[150px]">
                <IoIosMailOpen className="text-[#778768]" size={90} />
                <h1 className="text-3xl font-intersemibold mt-5">
                    6-Digit Code
                </h1>
                <h1 className="font-interlight text-sm text-[#3F454E] leading-tight max-w-[300px] text-center mt-3">
                    Code sent to{" "}
                    <span className="font-bold">arkiart@gmail.com</span> unless
                    you already have an account
                </h1>

                <div className="mt-8 mb-4">
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                <h1 className="text-[#3F454E] text-sm font-interlight">
                    Did not receive code?{" "}
                    <span className="text-[#778768] font-intersemibold hover:text-[#334628] cursor-pointer">
                        Resend Code
                    </span>
                </h1>

                <Link href="/otp-success">
                    <Button className="bg-[#778768] w-[260px] lg:w-[360px] h-[55px] font-bold mt-6">
                        VERIFY
                    </Button>
                </Link>

                <Link href="/signup">
                    <h1 className="text-[#50A7FF] text-[13px] hover:underline cursor-pointer mt-8">
                        Cancel
                    </h1>
                </Link>
            </div>

            <Footer />
        </div>
    );
};

export default page;
