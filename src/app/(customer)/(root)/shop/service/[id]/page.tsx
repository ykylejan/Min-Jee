"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Link from "next/link";
import { Slash } from "lucide-react";
import { IoMdHome } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { RootState } from "@/redux/store";
import RentalsSection from "@/components/RentalsSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apolloClient from "@/graphql/apolloClient";
import { GET_SERVICE_BY_ID } from "@/graphql/people";
import { addToCart } from "@/redux/slices/cartSlice";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const { id } = React.use(params);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const {
    data: serviceData,
    loading: serviceLoading,
    error: serviceError,
  } = useQuery(GET_SERVICE_BY_ID, {
    variables: { id },
    client: apolloClient,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set default selected item when data loads
  useEffect(() => {
    if (serviceData?.getServiceById?.serviceItems?.length > 0) {
      setSelectedItemId(serviceData.getServiceById.serviceItems[0].id);
    }
  }, [serviceData]);

  if (!isMounted) return null;
  if (serviceLoading)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">Loading...</div>
    );
  if (serviceError)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
        Error: {serviceError.message}
      </div>
    );
  if (!serviceData?.getServiceById)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
        Service not found
      </div>
    );

  const service = serviceData.getServiceById;
  const serviceItems = service.serviceItems || [];
  const selectedItem =
    serviceItems.find((item: any) => item.id === selectedItemId) ||
    serviceItems[0];

  const handleAddToCart = () => {
    if (!selectedItem) return;

    // Check if already in cart (optional, can be expanded)
    const cartItem = cartItems.find(
      (item) => item.id === selectedItem.id && item.category === "service"
    );
    if (cartItem) {
      toast.error("This service item is already in your cart.");
      return;
    }

    dispatch(
      addToCart({
        id: selectedItem.id,
        name: `${service.name} - ${selectedItem.name}`,
        price: selectedItem.price,
        quantity: 1,
        image: service.img,
        category: "service",
      })
    );
    toast.success(`${selectedItem.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
      <div className="flex gap-x-12 justify-center">
        <Fragment key={service.id}>
          <div>
            <img
              src={service.img || "/assets/images/balloonArangement.png"}
              alt={service.name}
              className="aspect-square h-[500px] rounded-md object-cover"
            />
          </div>

          <div className="font-afacad w-1/2 px-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-lg">
                    <IoMdHome />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <Link href={"/shop"}>Shop</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg">
                    {service.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center space-x-8 mt-3 justify-between">
              <div>
                <h1 className="text-5xl font-afacad_semibold">
                  {service.name}
                </h1>
                <h1 className="text-3xl font-afacad">
                  PHP {selectedItem?.price?.toLocaleString() ?? "-"}
                </h1>
              </div>

              <MdContentCopy
                size={25}
                className="text-[#6B7280] hover:text-black cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              />
            </div>

            <div className="mt-16">
              <h1 className="font-afacad_semibold text-md">Service Item</h1>
              <Select
                value={selectedItemId ?? ""}
                onValueChange={setSelectedItemId}
              >
                <SelectTrigger className="min-w-80 h-12 bg-white px-5">
                  <SelectValue placeholder="Select the service item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {serviceItems.map((item: any) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5 hover:bg-[#1E293B]"
              onClick={handleAddToCart}
              disabled={!selectedItem}
            >
              Add to basket
            </Button>

            <div className="mt-16">
              <h1 className="font-afacad_semibold mb-2">Description</h1>
              <p className="text-stone-800">
                {selectedItem?.description || "No description available"}
              </p>
            </div>

            <div className="mt-16">
              <h1 className="font-afacad_semibold text-base">Categories</h1>
              <Badge variant="outline" className="text-[#6B7280] font-afacad">
                Service
              </Badge>
            </div>
          </div>
        </Fragment>
      </div>

      <div className="px-12 pt-32">
        <RentalsSection label="Related Items" />
      </div>
    </div>
  );
};

export default Page;
