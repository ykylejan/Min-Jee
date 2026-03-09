"use client";

import React, { useState, useEffect } from "react";
import ProfileScreen from "@/components/AccountPage/ProfileScreen";
import OrdersScreen from "@/components/AccountPage/OrdersScreen";
import EventsScreen from "@/components/AccountPage/EventsScreen";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import api from "@/app/utils/api";



interface CustomerData {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  contact_number: string;
  verifyEmail: boolean;
  verifyNumber: boolean;
}

const Page = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [isScreen, setIsScreen] = useState(tabParam || "Profile");
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());

    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await api.get(
          `http://localhost:8000/api/v1/u/customer/index`
        );
        setCustomerData(response.data.customer);
      } catch (error: any) {
        console.error("Error fetching customer data:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-[80px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-48">
        <h1 className="text-2xl font-intermedium py-2">Account</h1>
        <div className="bg-white border border-[#D2D6DA] w-full h-auto rounded-lg p-6 md:p-14 flex justify-center">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-[80px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-48">
        <h1 className="text-2xl font-intermedium py-2">Account</h1>
        <div className="bg-white border border-[#D2D6DA] w-full h-auto rounded-lg p-6 md:p-14 flex justify-center">
          <p className="text-red-500">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-[80px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-48">
      <h1 className="text-2xl font-intermedium py-2">Account</h1>

      <div className="bg-white border border-[#D2D6DA] w-full h-auto rounded-lg p-6 md:p-14 flex flex-col md:flex-row">
        <div className="font-poppins flex md:block gap-4 md:gap-0 md:space-y-8 md:pr-48 border-b md:border-b-0 pb-4 md:pb-0 mb-6 md:mb-0 overflow-x-auto">
          <h1
            onClick={() => setIsScreen("Profile")}
            className={`hover:cursor-pointer whitespace-nowrap ${
              isScreen == "Profile" ? "font-poppins_bold" : ""
            }`}
          >
            Profile
          </h1>
          <h1
            onClick={() => setIsScreen("Orders")}
            className={`hover:cursor-pointer whitespace-nowrap ${
              isScreen == "Orders" ? "font-poppins_bold" : ""
            }`}
          >
            Orders
          </h1>
          <h1
            onClick={() => setIsScreen("Events")}
            className={`hover:cursor-pointer whitespace-nowrap ${
              isScreen == "Events" ? "font-poppins_bold" : ""
            }`}
          >
            Events
          </h1>
          <h1 onClick={handleLogout} className="underline hover:cursor-pointer whitespace-nowrap">
            Logout
          </h1>
        </div>

        <div className="w-full min-w-0">
          {isScreen === "Profile" ? (
            <ProfileScreen customerData={customerData} />
          ) : isScreen === "Orders" ? (
            <OrdersScreen />
          ) : isScreen === "Events" ? (
            <EventsScreen />
          ) : (
            <div className="">nothing</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
