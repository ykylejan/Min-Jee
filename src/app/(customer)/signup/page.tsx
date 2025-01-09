import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

const page = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF5] pt-[80px]">
            <Navbar />
            <div className="flex flex-col justify-center items-center pt-[80px]">
                <h1 className="font-intersemibold text-2xl">Sign Up</h1>
                <h1 className="font-interlight text-sm text-[#3F454E] leading-tight max-w-[300px] text-center mt-3">
                    Create your Min-jee account, and get access to an enhanced
                    ordering experience
                </h1>

                <div className="px-8">
                    <Input
                        placeholder="First Name"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-6 sm:mt-8 placeholder:text-[#BDC3C9]"
                    />
                    <Input
                        placeholder="Last Name"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9]"
                    />
                    <Input
                        placeholder="Contact Number"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9]"
                    />
                    <Input
                        placeholder="Email"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9]"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9]"
                    />
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="bg-white w-full sm:w-[360px] h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9]"
                    />

                    <h1 className="font-interlight text-sm text-[#3F454E] leading-tight max-w-[350px] text-center mt-16">
                        By creating an account, you agree to Min-Jee's{" "}
                        <Dialog>
                            <DialogTrigger>
                                <span className="underline hover:font-bold cursor-pointer">
                                    Privacy Policy
                                </span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Are you absolutely sure?
                                    </DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <span> and </span>
                        <Dialog>
                            <DialogTrigger>
                                <span className="underline hover:font-bold cursor-pointer">
                                    Terms of Use
                                </span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Are you absolutely sure?
                                    </DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </h1>

                    <Link href="/otp">
                        <Button className="bg-[#778768] w-full sm:w-[360px] h-[55px] font-bold mt-6 sm:mt-8">
                            SIGN UP
                        </Button>
                    </Link>
                </div>

                <h1 className="font-inter text-[13px] mt-20 mb-28">
                    <span className="text-[#BDC3C9]">
                        Already have an account?{" "}
                    </span>
                    <Link href="/login">
                        <span className="text-[#50A7FF] hover:underline cursor-pointer">
                            Log In.
                        </span>
                    </Link>
                </h1>
            </div>
            <Footer />
        </div>
    );
};

export default page;
