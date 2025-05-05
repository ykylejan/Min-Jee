import { Copyright } from "lucide-react";
import React from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {
    return (
        <div className="bg-camouflage-400 font-afacad text-white p-10 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="flex flex-col gap-4">
                    <div className="font-afacad_semibold text-2xl">
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
                    <div className="font-afacad_semibold text-2xl">
                        Shop
                    </div>
                    <ul className="space-y-2 text-sm md:text-base">
                        <li className="hover:text-[#334628] cursor-pointer">Rentals</li>
                        <li className="hover:text-[#334628] cursor-pointer">Services</li>
                        <li className="hover:text-[#334628] cursor-pointer">Events</li>
                    </ul>
                </div>


                <div className="flex flex-col gap-4">
                    <div className="font-afacad_semibold text-2xl">
                        Socials
                    </div>
                    <div className="text-sm md:text-base">
                        Visit our social medias for more information of our business
                    </div>
                    <div className="flex items-center gap-x-3">
                        <FaFacebook color="white" className="w-7 h-7 cursor-pointer" />
                        <AiFillInstagram color="white" className="w-8 h-8 cursor-pointer" />
                        <FaTwitter color="white" className="w-7 h-7 cursor-pointer" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">

                <div className="flex flex-col gap-4">
                    <span className="text-4xl font-caveat_brush cursor-pointer">
                        MIN-JEE
                    </span>
                    <div className="flex gap-2 items-center text-sm md:text-base">
                        <Copyright size={20} strokeWidth={1} /> 2024 Developed
                        by KALMOT
                    </div>
                </div>


                <div></div>


                <div className="flex flex-col gap-4">
                    <div className="font-afacad_semibold text-2xl">
                        Location
                    </div>
                    <ul className="space-y-2 text-sm md:text-base">
                        <li>
                            Door 3 Piquero Complex Hope Avenue, Bangkal D.C.
                        </li>
                        <li>Open 10am — 5pm Daily</li>
                    </ul>
                </div>
            </div>

            <div className="py-3"></div>

        </div>
    );
};

export default Footer;
