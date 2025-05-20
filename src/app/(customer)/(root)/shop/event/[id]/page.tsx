"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { parse, format } from "date-fns";
import { GET_EVENT_BY_ID } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import Cookies from "js-cookie";


const BookEventModal = ({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [form, setForm] = React.useState({
    name: "",
    location: "",
    customizations: "",
    event_date: "",
    event_address: "",
    minjee_venue: false,
    event_start: "",
    event_end: "",
  });

  React.useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        location: "",
        customizations: "",
        event_date: "",
        event_address: "",
        minjee_venue: false,
        event_start: "",
        event_end: "",
      });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
      <div className="bg-white rounded-lg w-[500px] p-8 relative">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl font-afacad_medium flex items-center mb-4">
            Book Event Details
          </h2>
          <X onClick={onClose} />
        </div>

        <div className="space-y-4">
          <div>
            <label>Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
              className="h-12"
            />
          </div>
          <div>
            <label>Location</label>
            <Input
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              placeholder="03 Red Stone, Calinan, Davao City"
              className="h-12"
            />
          </div>

          <div>
            <label>Event Date</label>
            <Input
              type="date"
              value={form.event_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, event_date: e.target.value }))
              }
              className="h-12"
            />
          </div>
          <div>
            <label>Event Address</label>
            <Input
              value={form.event_address}
              onChange={(e) =>
                setForm((f) => ({ ...f, event_address: e.target.value }))
              }
              placeholder="Event address"
              className="h-12"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-full">
              <label>Event Start</label>
              <Input
                type="time"
                value={form.event_start}
                onChange={(e) =>
                  setForm((f) => ({ ...f, event_start: e.target.value }))
                }
                className="h-10"
              />
            </div>
            <div className="w-full">
              <label>Event End</label>
              <Input
                type="time"
                value={form.event_end}
                onChange={(e) =>
                  setForm((f) => ({ ...f, event_end: e.target.value }))
                }
                className="h-10"
              />
            </div>
          </div>
          <div>
            <label>Customizations</label>
            <Textarea
              value={form.customizations}
              onChange={(e) =>
                setForm((f) => ({ ...f, customizations: e.target.value }))
              }
              placeholder="Write your customizations here"
              className="h-20"
            />
          </div>
        </div>
        <Button
          className="w-full mt-6 h-12"
          onClick={() => {
            onSubmit(form);
            onClose();
          }}
        >
          Book Now!
        </Button>
      </div>
    </div>
  );
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const { id } = React.use(params);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaxId, setSelectedPaxId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const role = useSelector((state: RootState) => state.auth.role);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useQuery(GET_EVENT_PACKAGE_BY_ID, {
    variables: { id },
    client: apolloClient,
  });

  // const {
  //   data: eventData,
  //   loading: eventLoading,
  //   error: eventError,
  // } = useQuery(GET_EVENT_BY_ID, {
  //   variables: { id },
  //   client: apolloClientPartner,
  // });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set default selected pax when data loads
  useEffect(() => {
    if (data?.getEventsPackageById?.pax?.length > 0) {
      setSelectedPaxId(data.getEventsPackageById.pax[0].id);
    }
  }, [data]);

  const handleBookEvent = async (form: any) => {
    setIsSubmitting(true);
    if (!isAuthenticated || role !== "customer" || !accessToken) {
      toast.error("Please login as a customer to book an event.");
      router.push("/login");
      return;
    }

    if (!selectedPaxId) {
      toast.error("Please select a pax option.");
      return;
    }

    try {
      const eventDate = form.event_date; // "YYYY-MM-DD"
      const startTime = form.event_start; // "HH:mm"
      const endTime = form.event_end; // "HH:mm"

      // Parse and format as time-only with milliseconds and Z
      const startDateObj = parse(
        `${eventDate} ${startTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const endDateObj = parse(
        `${eventDate} ${endTime}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const event_start = format(startDateObj, "HH:mm:ss.SSS'Z'");
      const event_end = format(endDateObj, "HH:mm:ss.SSS'Z'");

      const body = {
        data: {
          name: form.name,
          location: form.location,
          customizations: form.customizations,
          customizations_price: 0,
          event_status: "pending",
          event_date: eventDate,
          event_address: form.event_address,
          minjee_venue: form.minjee_venue,
          event_start,
          event_end,
          is_done: false,
          pax_id: selectedPaxId,
        },
        addons: [],
      };
      
      const accessToken = Cookies.get("accessToken");
      const res = await api.post("/u/events/", body, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      // console.log("RESPONSE DATA BOOKING:", res.data.event_id);
      // setEventId(res.data.event_id);

      router.push(`/shop/event/${id}/receipt/${res.data.event_id}`);
      toast.success("Booking successful!", {
        description: "Your event booking has been submitted for approval.",
      });
      setIsBooked(true);
    } catch (error: any) {
      toast.error("Booking failed", {
        description:
          error?.response?.data?.detail?.[0]?.msg ||
          "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

              <Button
                onClick={() => setModalOpen(true)}
                className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book Event"}
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
      <BookEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleBookEvent}
      />
    </div>
  );
};

export default Page;
