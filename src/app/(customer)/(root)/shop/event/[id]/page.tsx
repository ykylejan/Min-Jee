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
import { useQuery } from "@apollo/client";
import apolloClient from "@/graphql/apolloClient";
import { GET_EVENT_PACKAGE_BY_ID } from "@/graphql/people";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const { id } = React.use(params);

  const [selectedPaxId, setSelectedPaxId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { data, loading, error } = useQuery(GET_EVENT_PACKAGE_BY_ID, {
    variables: { id },
    client: apolloClient,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set default selected pax when data loads
  useEffect(() => {
    if (data?.getEventsPackageById?.pax?.length > 0) {
      setSelectedPaxId(data.getEventsPackageById.pax[0].id);
    }
  }, [data]);

  if (!isMounted) return null;
  if (loading)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">Loading...</div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
        Error: {error.message}
      </div>
    );
  if (!data?.getEventsPackageById)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
        Event package not found
      </div>
    );

  const event = data.getEventsPackageById;
  const paxOptions = event.pax || [];
  const selectedPax =
    paxOptions.find((p: any) => p.id === selectedPaxId) || paxOptions[0];

  return (
    <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
      <div>
        <div className="flex gap-x-12 justify-center">
          <Fragment key={event.id}>
            <div>
              <img
                src={event.img || "/assets/images/balloonArangement.png"}
                alt={event.name}
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
                      {event.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center space-x-8 mt-3 justify-between">
                <div>
                  <h1 className="text-5xl font-afacad_semibold">
                    {event.name}
                  </h1>
                  <h1 className="text-3xl font-afacad">
                    PHP {selectedPax?.price?.toLocaleString() ?? "-"}
                  </h1>
                </div>

                <MdContentCopy
                  size={25}
                  className="text-[#6B7280] hover:text-black cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                />
              </div>

              <div className="mt-16">
                <h1 className="font-afacad_semibold text-md">Pax</h1>
                <Select
                  value={selectedPaxId ?? ""}
                  onValueChange={setSelectedPaxId}
                >
                  <SelectTrigger className="min-w-80 h-12 bg-white px-5">
                    <SelectValue placeholder="Select the pax amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {paxOptions.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <h1 className="font-afacad_semibold text-md mt-6">Add-ons</h1>
                {/* Add-ons logic here if needed */}
              </div>

              <Button className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5">
                Book Event
              </Button>

              <div className="mt-16">
                <h1 className="font-afacad_semibold mb-2">Description</h1>
                <p className="text-stone-800">
                  {selectedPax?.description || "No description available"}
                </p>
              </div>

              <div className="mt-16">
                <h1 className="font-afacad_semibold text-base">Categories</h1>
                <Badge variant="outline" className="text-[#6B7280] font-afacad">
                  Events
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
