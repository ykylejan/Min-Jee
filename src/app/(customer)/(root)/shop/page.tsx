"use client";

import ProductItem from "@/components/ProductItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { TbListSearch } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import apolloClient from "@/graphql/apolloClient";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENT_PACKAGES, GET_ALL_SERVICES } from "@/graphql/people";
import { GET_ALL_RENTALS } from "@/graphql/products";
import { useRouter } from "next/navigation";
const formatPrice = (price: any): string => {
  // Handle null, undefined, empty string
  if (price == null || price === "") return "0.00";

  // Convert to number
  const numericValue = Number(price);

  // Check if conversion was successful
  if (isNaN(numericValue)) return "0.00";

  // Format with 2 decimal places and comma separators
  return numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ShopPage = () => {
  const [isTitle, setIsTitle] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTab") || "rentals";
    }
    return "rentals";
  });

  useEffect(() => {
    localStorage.setItem("selectedTab", isTitle);
  }, [isTitle]);

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // State for fetched data
  const [rentals, setRentals] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Apollo queries
  const {
    loading: rentalsLoading,
    error: rentalsError,
    data: rentalsData,
  } = useQuery(GET_ALL_RENTALS, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  const {
    loading: servicesLoading,
    error: servicesError,
    data: servicesData,
  } = useQuery(GET_ALL_SERVICES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  const {
    loading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = useQuery(GET_ALL_EVENT_PACKAGES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  // Populate state when data changes
  useEffect(() => {
    if (rentalsData?.getRentals) {
      console.log("RENTALS DATA:", rentalsData?.getRentals);

      setRentals(rentalsData?.getRentals);
    }
  }, [rentalsData]);

  useEffect(() => {
    if (servicesData?.getServices) {
      setServices(servicesData.getServices);
    }
  }, [servicesData]);

  useEffect(() => {
    if (eventsData?.getEventPackages) {
      setEvents(eventsData.getEventPackages);
    }
  }, [eventsData]);

  const getItemTypeById = (id: string) => {
    if (rentalsData?.getRentals?.some((item: any) => item.id === id)) {
      return "rental";
    }
    if (servicesData?.getServices?.some((item: any) => item.id === id)) {
      return "service";
    }
    if (eventsData?.getEventPackages?.some((item: any) => item.id === id)) {
      return "event";
    }
    return null;
  };

  const handleItemClick = (itemId: string) => {
    const itemType = getItemTypeById(itemId);
    if (itemType) {
      router.push(`/shop/${itemType}/${itemId}`);
    }
  };

  // Filtering logic for search
  const filteredRentals = rentals.filter((rental) =>
    rental.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  // if (rentalsLoading || servicesLoading || eventsLoading) {
  //   return (
  //     <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-40 flex justify-center items-center">
  //       <div className="text-[#778768] text-xl">Loading...</div>
  //     </div>
  //   );
  // }

  // Error state
  if (rentalsError || servicesError || eventsError) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-40 flex justify-center items-center">
        <div className="text-red-500 text-xl">
          Error loading data. Please try again later.
        </div>
      </div>
    );
  }

  const getCurrentTabData = () => {
    switch (isTitle) {
      case "rentals":
        return filteredRentals;
      case "services":
        return filteredServices;
      case "events":
        return filteredEvents;
      default:
        return [];
    }
  };

  const currentData = getCurrentTabData();

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[120px] pb-40">
      <div className="text-[#778768] flex flex-col items-center justify-center text-center">
        <h1 className="text-8xl font-caveat_semibold mt-5">
          {isTitle.charAt(0).toUpperCase() + isTitle.slice(1).toLowerCase()}
        </h1>
      </div>

      <div className="px-24 pt-8 pb-4">
        <Tabs
          defaultValue={isTitle}
          onValueChange={(value) => {
            setIsTitle(value);
          }}
        >
          <div className="flex justify-center pb-8">
            <TabsList>
              <TabsTrigger
                value="rentals"
                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 data-[state=active]:font-afacad_semibold"
              >
                Rentals
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 data-[state=active]:font-afacad_semibold"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 data-[state=active]:font-afacad_semibold"
              >
                Events
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex justify-center pb-10">
            <div className="relative w-[530px]">
              <Input
                placeholder={`Search for ${isTitle.toLowerCase()}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white p-6 w-full pl-10"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <TabsContent
            value={isTitle}
            className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10"
          >
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div
                  key={item.id}
                  // href={`/shop/${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <ProductItem
                    image={item.img.toString() || "/placeholder-product.jpg"}
                    name={item.name}
                    price={item.price ? "PHP " + item.price : "Price May Vary"}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col justify-center items-center text-center mt-10">
                <TbListSearch color="#BDC3C9" size={65} />
                <h1 className="text-neutral-500 text-2xl font-afacad">
                  {searchQuery
                    ? "No matching products found"
                    : "No products available"}
                </h1>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopPage;
