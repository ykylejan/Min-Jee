import { Copyright } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <div className="bg-[#778768] font-afacad text-white p-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="flex flex-col gap-4">
                    <div className="font-afacadsemibold text-2xl">
                        Party Needs and Services
                    </div>
                    <div className="text-sm md:text-base">
                        Min-Jee is a quality provider for party supplies and
                        services located in Bangkal Davao City. We offer quality
                        rentals and organized events. Come inquire to our services
                        and commit a memorable celebration!
                    </div>
                </div>

                
                <div className="flex flex-col gap-4 items-start md:items-center">
                    <div className="font-afacadsemibold text-2xl">
                        Shop
                    </div>
                    <ul className="space-y-2 text-sm md:text-base">
                        <li>Rentals</li>
                        <li>Services</li>
                        <li>Events</li>
                    </ul>
                </div>

                
                <div className="flex flex-col gap-4">
                    <div className="font-afacadsemibold text-2xl">
                        Newsletter
                    </div>
                    <div className="text-sm md:text-base">
                        Sign up for our newsletter to only receive good things
                    </div>
                    <div className="flex gap-2">
                        <img
                            src="/facebook.svg"
                            alt="logo"
                            className="w-8 h-8 hover:cursor-pointer"
                        />
                        <img
                            src="/instagram.svg"
                            alt="logo"
                            className="w-8 h-8 hover:cursor-pointer"
                        />
                        <img
                            src="/twitter.svg"
                            alt="logo"
                            className="w-8 h-8 hover:cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">
                
                <div className="flex flex-col gap-4">
                    <span className="text-4xl font-caveat cursor-pointer">
                        MIN-JEE
                    </span>
                    <div className="flex gap-2 items-center text-sm md:text-base">
                        <Copyright size={20} strokeWidth={1}/> 2024 Developed
                        by KALMOT
                    </div>
                </div>

                
                <div></div>

                
                <div className="flex flex-col gap-4">
                    <div className="font-afacadsemibold text-2xl">
                        Location
                    </div>
                    <ul className="space-y-2 text-sm md:text-base">
                        <li>
                            Door 3 Piquero Complex Hope Avenue, Bangkal D.C.
                        </li>
                        <li>Open 12pm - 8pm Daily</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;
