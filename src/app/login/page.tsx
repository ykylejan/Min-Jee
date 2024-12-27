import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const page = () => {
    return (
        <div className="">
            <Navbar />
            <div className="bg-[#FFFBF5]">
                <div className="flex flex-col justify-center items-center min-h-screen">
                    <img src="/leaflogo.svg" alt="logo" />
                    <h1 className="font-intersemibold text-2xl mt-8">
                        Log in to Min-Jee
                    </h1>
                    <Input
                        placeholder="Email"
                        className="bg-white  w-[360px] h-[55px] font-inter mt-8 placeholder:text-[#BDC3C9]"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="bg-white w-[360px] h-[55px] font-inter mt-3 placeholder:text-[#BDC3C9]"
                    />
                    <Button className="bg-[#778768] w-[360px] h-[55px] font-bold mt-8">
                        Continue
                    </Button>

                    <h1 className="font-inter text-[13px] mt-20">
                        <span className="text-[#BDC3C9]">
                            Don't have an account?{" "}
                        </span>
                        <span className="text-[#50A7FF] hover:underline cursor-pointer">Sign up!</span>
                    </h1>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default page;
