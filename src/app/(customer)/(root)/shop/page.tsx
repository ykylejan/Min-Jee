"use client";

import ProductItem from "@/components/ProductItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { TbListSearch } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import apolloClient from "@/graphql/apolloClient";
import { useLazyQuery } from "@apollo/client";
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

  // Apollo lazy queries - only fetch when tab is selected
  const [
    fetchRentals,
    { loading: rentalsLoading, error: rentalsError, data: rentalsData },
  ] = useLazyQuery(GET_ALL_RENTALS, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  const [
    fetchServices,
    { loading: servicesLoading, error: servicesError, data: servicesData },
  ] = useLazyQuery(GET_ALL_SERVICES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  const [
    fetchEvents,
    { loading: eventsLoading, error: eventsError, data: eventsData },
  ] = useLazyQuery(GET_ALL_EVENT_PACKAGES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  // Fetch data for the current tab when it changes
  useEffect(() => {
    if (isTitle === "rentals" && !rentalsData && !rentalsLoading) {
      fetchRentals();
    } else if (isTitle === "services" && !servicesData && !servicesLoading) {
      fetchServices();
    } else if (isTitle === "events" && !eventsData && !eventsLoading) {
      fetchEvents();
    }
  }, [isTitle, rentalsData, servicesData, eventsData, rentalsLoading, servicesLoading, eventsLoading, fetchRentals, fetchServices, fetchEvents]);

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

  // Error state - only show for current tab
  const getCurrentTabError = () => {
    switch (isTitle) {
      case "rentals":
        return rentalsError;
      case "services":
        return servicesError;
      case "events":
        return eventsError;
      default:
        return null;
    }
  };

  if (getCurrentTabError()) {
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

  const isCurrentTabLoading = () => {
    switch (isTitle) {
      case "rentals":
        return rentalsLoading || (!rentalsData && !rentalsError);
      case "services":
        return servicesLoading || (!servicesData && !servicesError);
      case "events":
        return eventsLoading || (!eventsData && !eventsError);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[100px] md:pt-[120px] pb-20 md:pb-40">
      <div className="text-[#778768] flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-caveat_semibold mt-3 md:mt-5">
          {isTitle.charAt(0).toUpperCase() + isTitle.slice(1).toLowerCase()}
        </h1>
      </div>

      <div className="px-4 sm:px-8 md:px-12 lg:px-24 pt-6 md:pt-8 pb-4">
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
                className="text-base md:text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 data-[state=active]:font-afacad_semibold"
              >
                Rentals
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="text-base md:text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 data-[state=active]:font-afacad_semibold"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-base md:text-xl font-afacad data-[state=active]:text-white data-[state=active]:bg-camouflage-400 data-[state=active]:font-afacad_semibold"
              >
                Events
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex justify-center pb-6 md:pb-10">
            <div className="relative w-full max-w-[530px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
              />
              <Input
                placeholder={`Search for ${isTitle.toLowerCase()}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white py-5 md:py-6 pr-4 w-full !pl-12"
              />
            </div>
          </div>

          <TabsContent
            value={isTitle}
            className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-10 lg:gap-x-16 md:gap-y-8"
          >
            {isCurrentTabLoading() ? (
              // Skeleton loading state
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <Skeleton className="w-full aspect-square rounded-md mb-2 md:mb-3 bg-camouflage-100" />
                  <Skeleton className="h-4 md:h-5 w-3/4 bg-camouflage-100" />
                  <Skeleton className="h-3 md:h-4 w-1/2 bg-camouflage-100" />
                </div>
              ))
            ) : currentData.length > 0 ? (
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
