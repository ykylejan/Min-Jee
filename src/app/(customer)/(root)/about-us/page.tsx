import React from "react";
import {
    Calendar,
    Gift,
    Users,
    Utensils,
    Clock,
    Award,
    Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const page = () => {
    return (
        <div className="font-afacad">
            <div className="bg-camouflage-600 text-white pt-10">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-caveat_bold tracking-tight sm:text-5xl lg:text-6xl">
                        About Min-Jee
                    </h1>
                    <p className="mt-6 text-xl max-w-3xl mx-auto font-afacad">
                        Creating memorable, stress-free events customized to
                        your unique needs and visions for over a decade.
                    </p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-caveat">
                            Our Story
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Min-Jee began as a passion project when our founder,
                            Rita Dellatan, organized a wedding for a close
                            friend. The success of that event inspired her to
                            turn her talent for event planning into a
                            family-owned business that has now served countless
                            clients for over a decade.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            What started as a small operation has grown into a
                            versatile event planning service that handles
                            everything from intimate birthday celebrations to
                            large corporate gatherings. Throughout our growth,
                            we've maintained our commitment to personalized
                            service and attention to detail.
                        </p>
                    </div>
                    <div className="mt-10 lg:mt-0 flex justify-center">
                        <div className="bg-gray-200 rounded-lg h-80 w-full flex items-center justify-center">
                            <Heart size={64} className="text-camouflage-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* What We Offer */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            What We Offer
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
                            Min-Jee provides comprehensive event solutions to
                            make your special occasions truly memorable.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white mb-4">
                                <Calendar />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 font-afacad_bold">
                                Event Planning
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                From birthdays and weddings to corporate events
                                and reunions, we plan and execute events of all
                                sizes with careful attention to your specific
                                requirements.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white mb-4">
                                <Utensils />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 font-afacad_bold">
                                Food Catering
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                Our catering services offer delicious menu
                                options that can be customized to your taste
                                preferences and dietary requirements.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white mb-4">
                                <Gift />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 font-afacad_bold">
                                Party Supplies
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                With over 200 rental items in our inventory,
                                from utensils to furniture, we have everything
                                you need to make your event perfect.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Why Choose Min-Jee?
                    </h2>
                    <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
                        We bring expertise, dedication, and a personal touch to
                        every event we organize.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white">
                                <Users />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Experienced Team
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                Our team brings years of experience in event
                                planning and management to ensure your event
                                runs smoothly from start to finish.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white">
                                <Award />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Personalized Service
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                We believe that every event is unique, which is
                                why we work closely with you to understand your
                                vision and bring it to life.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white">
                                <Clock />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Reliable and Timely
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                We value your time and ensure that all aspects
                                of your event are delivered on schedule,
                                allowing you to enjoy the moment worry-free.
                            </p>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-camouflage-400 text-white">
                                <Gift />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Comprehensive Packages
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                                From full-service event packages to individual
                                rentals, we offer flexible options to meet your
                                needs and budget.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Meet Our Team
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
                            The dedicated professionals behind Min-Jee's
                            exceptional service.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <Users size={64} className="text-gray-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Rita Dellatan
                                </h3>
                                <p className="text-sm text-camouflage-400">
                                    CEO & Founder
                                </p>
                                <p className="mt-3 text-base text-gray-500">
                                    Rita's passion for event planning began with
                                    organizing a friend's wedding, which sparked
                                    the creation of Min-Jee.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <Users size={64} className="text-gray-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    John Dellatan
                                </h3>
                                <p className="text-sm text-camouflage-400">
                                    Operations Manager
                                </p>
                                <p className="mt-3 text-base text-gray-500">
                                    John oversees the day-to-day operations,
                                    ensuring that every event is executed
                                    flawlessly.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <Users size={64} className="text-gray-400" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Maria Dellatan
                                </h3>
                                <p className="text-sm text-camouflage-400">
                                    Creative Director
                                </p>
                                <p className="mt-3 text-base text-gray-500">
                                    Maria brings creative vision to life,
                                    designing unique event concepts that leave
                                    lasting impressions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-[#334628] opacity-90">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl tracking-tight text-white sm:text-4xl">
                        <span className="block">
                            Ready to plan your next event?
                        </span>
                        <span className="block text-xl mt-2">
                            Let Min-Jee help make it unforgettable.
                        </span>
                    </h2>
                    <div className="space-x-3 mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-camouflage-400 bg-white hover:bg-gray-50">
                            Get Started
                        </Button>
                        
                        <Button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-camouflage-400 hover:bg-camouflage-400/80">
                            Contact Us
                        </Button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
