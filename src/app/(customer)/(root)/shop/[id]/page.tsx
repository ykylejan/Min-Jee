"use client";

import AddOn from "@/components/AddOn";
import RentalsSection from "@/components/RentalsSection";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { QuantityInput } from "@/components/ui/quantity-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slash } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import apolloClient from "@/graphql/apolloClient";
import {
  GET_RENTAL_BY_ID,
  GET_ALL_RENTALS as GET_ALL_RENTALS_PRODUCTS,
} from "@/graphql/products";
import {
  GET_SERVICE_BY_ID,
  GET_ALL_SERVICES,
  GET_EVENT_PACKAGE_BY_ID,
  GET_ALL_EVENT_PACKAGES,
} from "@/graphql/people";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  // State to determine type
  const [productType, setProductType] = useState<
    "Rental" | "Service" | "Event" | null
  >(null);

  // Fetch all to determine type
  const { data: rentalsList } = useQuery(GET_ALL_RENTALS_PRODUCTS, {
    client: apolloClient,
  });
  const { data: servicesList } = useQuery(GET_ALL_SERVICES, {
    client: apolloClient,
  });
  const { data: eventsList } = useQuery(GET_ALL_EVENT_PACKAGES, {
    client: apolloClient,
  });

  // Determine type on mount or when lists change
  useEffect(() => {
    if (rentalsList?.getRentals?.some((item: any) => item.id === id)) {
      setProductType("Rental");
    } else if (servicesList?.getServices?.some((item: any) => item.id === id)) {
      setProductType("Service");
    } else if (
      eventsList?.getEventPackages?.some((item: any) => item.id === id)
    ) {
      setProductType("Event");
    }
  }, [id, rentalsList, servicesList, eventsList]);

  // Fetch individual item based on type
  const {
    data: rentalData,
    loading: rentalLoading,
    error: rentalError,
  } = useQuery(GET_RENTAL_BY_ID, {
    variables: { id },
    skip: productType !== "Rental",
    client: apolloClient,
  });

  const {
    data: serviceData,
    loading: serviceLoading,
    error: serviceError,
  } = useQuery(GET_SERVICE_BY_ID, {
    variables: { id },
    skip: productType !== "Service",
    client: apolloClient,
  });

  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery(GET_EVENT_PACKAGE_BY_ID, {
    variables: { id },
    skip: productType !== "Event",
    client: apolloClient,
  });

  // Add-on state
  const [isVenue, setIsVenue] = useState(false);
  const [isKaraoke, setIsKaraoke] = useState(false);

  // Loading and error handling
  if (
    (productType === "Rental" && rentalLoading) ||
    (productType === "Service" && serviceLoading) ||
    (productType === "Event" && eventLoading)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-neutral-500">Loading...</h1>
      </div>
    );
  }

  if (
    (productType === "Rental" && rentalError) ||
    (productType === "Service" && serviceError) ||
    (productType === "Event" && eventError)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-500">Product not found.</h1>
      </div>
    );
  }

  // Get the product data
  let product: any = null;
  if (productType === "Rental") {
    product = rentalData?.getRentalsById;
  } else if (productType === "Service") {
    product = serviceData?.getServiceById;
  } else if (productType === "Event") {
    product = eventData?.getEventsPackageById;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-500">Product not found.</h1>
      </div>
    );
  }

  // Render
  return (
    <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
      <div className="">
        <div className="flex gap-x-12 justify-center">
          <Fragment key={product.id}>
            <div className="">
              <img
                src={product.img}
                alt="product-item"
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
                      {productType}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center space-x-8 mt-3 justify-between">
                <div>
                  <h1 className="text-5xl font-afacad_semibold">
                    {product.name}
                  </h1>
                  <h1 className="text-3xl font-afacad">
                    PHP {Number(product.price).toFixed(2)}
                  </h1>
                </div>

                <MdContentCopy
                  size={25}
                  className="text-[#6B7280] hover:text-black cursor-pointer"
                />
              </div>

              <div className="mt-16">
                {productType === "Rental" && (
                  <>
                    <h1 className="font-afacad_semibold text-md">Quantity</h1>
                    <QuantityInput
                      placeholder="Enter the amount to rent"
                      className="h-12 !text-base bg-white"
                    />
                  </>
                )}
                {productType === "Service" && (
                  <>
                    <h1 className="font-afacad_semibold text-md">Pax</h1>
                    <Select>
                      <SelectTrigger className="min-w-80 h-12 bg-white px-5">
                        <SelectValue placeholder="Select the pax amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="50">50 pax</SelectItem>
                          <SelectItem value="75">75 pax</SelectItem>
                          <SelectItem value="100">100 pax</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </>
                )}
                {productType === "Event" && (
                  <>
                    <h1 className="font-afacad_semibold text-md">Pax</h1>
                    <Select>
                      <SelectTrigger className="min-w-80 h-12 bg-white px-5">
                        <SelectValue placeholder="Select the pax amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="50">50 pax</SelectItem>
                          <SelectItem value="75">75 pax</SelectItem>
                          <SelectItem value="100">100 pax</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <h1 className="font-afacad_semibold text-md mt-6">
                      Add-ons
                    </h1>

                    <div className="mb-14 flex gap-x-10">
                      <AddOn
                        name="Venue"
                        price={5000}
                        onClick={() => setIsVenue(!isVenue)}
                        selected={isVenue}
                      />
                      <AddOn
                        name="Karaoke"
                        price={500}
                        onClick={() => setIsKaraoke(!isKaraoke)}
                        selected={isKaraoke}
                      />
                    </div>
                  </>
                )}
              </div>

              <Button className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5">
                Add to basket
              </Button>

              <div className="mt-16">
                <h1 className="font-afacad_semibold mb-2">Description</h1>
                <p className="text-stone-800">
                  {product.description || "No description provided."}
                </p>
              </div>

              <div className="mt-16">
                <h1 className="font-afacad_semibold text-base">Categories</h1>
                <Badge variant="outline" className="text-[#6B7280] font-afacad">
                  {productType}
                </Badge>
              </div>
            </div>
          </Fragment>
        </div>

        <div className="px-12 pt-32">
          <RentalsSection label="Related Items" />
        </div>
      </div>
    </div>
  );
};

export default Page;
