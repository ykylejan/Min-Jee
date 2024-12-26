import { Copyright } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <div className="bg-[#778768] h-[508px] font-afacad text-white pl-24 pr-24 pt-10">
            <div className="grid grid-cols-9 grid-rows-4 gap-3">
                <div className="col-span-4 font-afacadsemibold text-2xl">
                    Party Needs and Services
                </div>
                <div className="col-span-2 col-start-5 font-afacadsemibold text-2xl">
                    Shop
                </div>
                <div className="col-span-3 col-start-7 font-afacadsemibold text-2xl">
                    Newsletter
                </div>

                <div className="col-span-4 row-span-3 row-start-2 pr-36">
                    Min-Jee is a quality provider for party supplies and
                    services located in Bangkal Davao City. We offer quality
                    rentals and organized events. Come inquire to our services
                    and commit a memorable celebration!
                </div>
                <div className="col-span-2 row-span-3 col-start-5 row-start-2">
                    <ul className="space-y-2">
                        <li>Rentals</li>
                        <li>Services</li>
                        <li>Events</li>
                    </ul>
                </div>
                <div className="col-span-3 row-span-3 col-start-7 row-start-2">
                    Sign up for our newsletter to only receive good things
                    <div className="flex gap-2 mt-10">
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

            <div className="grid grid-cols-9 grid-rows-4 gap-3 mt-24">
                <div className="col-span-4">
                    <span className="text-4xl font-caveat cursor-pointer">
                        MIN-JEE
                    </span>
                </div>
                <div className="col-span-2 col-start-5 font-afacadsemibold text-2xl"></div>
                <div className="col-span-3 col-start-7 font-afacadsemibold text-2xl">
                    Location
                </div>

                <div className="col-span-4 row-span-3 row-start-2 mt-16">
                    <div className="flex gap-2">
                        <Copyright size={20} strokeWidth={1}/> 2024 Developed
                        by KALMOT
                    </div>
                </div>
                <div className="col-span-2 row-span-3 col-start-5 row-start-2"></div>
                <div className="col-span-3 row-span-3 col-start-7 row-start-2">
                    <ul className="space-y-2">
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
