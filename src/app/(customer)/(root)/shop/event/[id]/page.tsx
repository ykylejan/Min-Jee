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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slash } from "lucide-react";
import { CalendarDays, Clock, MapPin, User, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { useQuery } from "@apollo/client";
import apolloClient from "@/graphql/apolloClient";
import { GET_EVENT_PACKAGE_BY_ID } from "@/graphql/people";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { parse, format } from "date-fns";
import { GET_EVENT_BY_ID } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import Cookies from "js-cookie";


const BookEventSheet = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
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

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-0"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl font-afacad_semibold">
              Book This Event
            </SheetTitle>
            <SheetDescription>
              Fill in your details below to reserve your event package.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User className="h-4 w-4" /> Personal Info
              </h3>
              <div className="space-y-2">
                <Label htmlFor="book-name">Full Name</Label>
                <Input
                  id="book-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-location">Your Location</Label>
                <Input
                  id="book-location"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="03 Red Stone, Calinan, Davao City"
                  className="h-11"
                />
              </div>
            </div>

            <hr />

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Event Details
              </h3>
              <div className="space-y-2">
                <Label htmlFor="book-date">Event Date</Label>
                <Input
                  id="book-date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, event_date: e.target.value }))
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="book-address" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Event Address
                </Label>
                <Input
                  id="book-address"
                  value={form.event_address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, event_address: e.target.value }))
                  }
                  placeholder="Venue address"
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="book-start" className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Start Time
                  </Label>
                  <Input
                    id="book-start"
                    type="time"
                    value={form.event_start}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, event_start: e.target.value }))
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="book-end" className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> End Time
                  </Label>
                  <Input
                    id="book-end"
                    type="time"
                    value={form.event_end}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, event_end: e.target.value }))
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Customizations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Customizations
              </h3>
              <div className="space-y-2">
                <Label htmlFor="book-custom">Special Requests</Label>
                <Textarea
                  id="book-custom"
                  value={form.customizations}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customizations: e.target.value }))
                  }
                  placeholder="Color themes, specific decorations, dietary requirements..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 bg-background">
            <Button
              className="w-full h-12 rounded-xl text-base font-semibold"
              disabled={isSubmitting}
              onClick={() => {
                onSubmit(form);
              }}
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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
      <div className="min-h-screen bg-[#FFFBF5] px-5 pt-28 sm:px-8 md:px-16 lg:px-24 lg:pt-44">Loading...</div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-5 pt-28 sm:px-8 md:px-16 lg:px-24 lg:pt-44">
        Error: {error.message}
      </div>
    );
  if (!data?.getEventsPackageById)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-5 pt-28 sm:px-8 md:px-16 lg:px-24 lg:pt-44">
        Event package not found
      </div>
    );

  const event = data.getEventsPackageById;
  const paxOptions = event.pax || [];
  const selectedPax =
    paxOptions.find((p: any) => p.id === selectedPaxId) || paxOptions[0];

  return (
    <div className="min-h-screen bg-[#FFFBF5] px-5 pt-28 sm:px-8 md:px-16 lg:px-24 lg:pt-44">
      <div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-x-12 justify-center">
          <Fragment key={event.id}>
            <div className="w-full lg:w-auto flex justify-center">
              <img
                src={event.img || "/assets/images/balloonArangement.png"}
                alt={event.name}
                className="aspect-square w-full max-w-[500px] h-auto sm:h-[400px] lg:h-[500px] rounded-md object-cover"
              />
            </div>

            <div className="font-afacad w-full lg:w-1/2 px-0 lg:px-10">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-base lg:text-lg">
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
                    <BreadcrumbPage className="text-base lg:text-lg truncate max-w-[200px]">
                      {event.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-4 sm:gap-8 mt-3 justify-between">
                <div className="min-w-0">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-afacad_semibold break-words">
                    {event.name}
                  </h1>
                  <h1 className="text-2xl sm:text-3xl font-afacad">
                    PHP {selectedPax?.price?.toLocaleString() ?? "-"}
                  </h1>
                </div>

                <MdContentCopy
                  size={25}
                  className="text-[#6B7280] hover:text-black cursor-pointer shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                />
              </div>

              <div className="mt-8 lg:mt-16">
                <h1 className="font-afacad_semibold text-md">Pax</h1>
                <Select
                  value={selectedPaxId ?? ""}
                  onValueChange={setSelectedPaxId}
                >
                  <SelectTrigger className="w-full sm:min-w-80 h-12 bg-white px-5">
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

              <div className="mt-8 lg:mt-16">
                <h1 className="font-afacad_semibold mb-2">Description</h1>
                <p className="text-stone-800">
                  {selectedPax?.description || "No description available"}
                </p>
              </div>

              <div className="mt-8 lg:mt-16 pb-8 lg:pb-0">
                <h1 className="font-afacad_semibold text-base">Categories</h1>
                <Badge variant="outline" className="text-[#6B7280] font-afacad">
                  Events
                </Badge>
              </div>
            </div>
          </Fragment>
        </div>

        <div className="px-0 sm:px-6 lg:px-12 pt-16 lg:pt-32">
          <RentalsSection label="Related Items" />
        </div>
      </div>
      <BookEventSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleBookEvent}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Page;
