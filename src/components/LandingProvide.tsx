import React from "react";
import { FaCalendarDay } from "react-icons/fa";
import { GiPaperWindmill } from "react-icons/gi";
import { MdChair } from "react-icons/md";

const LandingProvide = () => {
    return (
        <section className="mb-24">
            <h1 className="text-3xl font-afacad_semibold">What We Provide</h1>
            <hr className="mb-5" />

            <div className="grid grid-cols-3 grid-rows-1 gap-8">
                <div className="space-y-2">
                    <MdChair size={60} className="text-[#778768]" />
                    <h1 className="text-xl font-afacad_medium">
                        Event Essentials
                    </h1>
                    <p className="font-afacad">
                        From tables and chairs to elegant dinnerware, we offer a
                        wide range of rental items to suit any event style.
                    </p>
                </div>
                <div className="space-y-2">
                    <GiPaperWindmill size={60} className="text-[#778768]" />
                    <h1 className="text-xl font-afacad_medium">
                        Decor and Ambiance
                    </h1>
                    <p className="font-afacad">
                        Transform your venue with our curated collection of
                        decor, lighting, and custom backdrops.
                    </p>
                </div>
                <div className="space-y-2">
                    <FaCalendarDay size={60} className="text-[#778768]" />
                    <h1 className="text-xl font-afacad_medium">
                        Tailored Event Planning
                    </h1>
                    <p className="font-afacad">
                        Need assistance bringing your vision to life? Our
                        experts are here to coordinate every detail.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LandingProvide;
