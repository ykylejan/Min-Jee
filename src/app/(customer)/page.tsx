'use client'

import LandingProvide from "@/components/LandingPage/LandingProvide";
import RentalsSection from "@/components/RentalsSection";
import LandingGrid from "@/components/LandingPage/LandingGrid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { images } from "@/constants";


const page = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#FFFBF5]">
            <div className="h-screen w-full bg-cover bg-center">
                <img
                    src={images.landingImage.src}
                    alt="landing_image"
                    className="w-full h-full object-cover"
                />
                <div className="relative w-full h-full">
                    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black bg-opacity-70 text-center -mt-[100vh]">
                        <h1 className="text-lg lg:text-2xl font-caveat font-light">
                            PARTY NEEDS AND SERVICES
                        </h1>
                        <h1 className="text-7xl lg:text-8xl font-caveat_semibold mt-5">
                            MIN-JEE
                        </h1>
                        <h1 className="text-white text-lg lg:text-2xl font-sans font-thin px-10 md:px-40 lg:px-96 mt-8">
                            Seamless rentals, tailored events—bringing your
                            celebration dreams to life with ease.
                        </h1>
                        <Button onClick={() => router.push("/shop")} className="bg-[#D9D9D9] text-[#3F454E] w-52 h-12 rounded-full font-inder mt-16">
                            Discover our Shop
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-10 lg:px-24 py-16">
                <LandingProvide />

                <RentalsSection />

                <LandingGrid />
            </div>
        </div>
    );
};

export default page;
