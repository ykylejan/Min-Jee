"use client";

import { Input } from "@/components/ui/input";
import { MoveLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import StatusLabel from "@/components/StatusLabel";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@apollo/client";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { parse, format } from "date-fns";
import { GET_EVENT_BY_ID_OWNER } from "@/graphql/people";
import { Textarea } from "@/components/ui/textarea";


const obtainmentOptions = [
  { label: "Shipped", value: "true" },
  { label: "Pick-Up", value: "false" },
];

const eventStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

// Utility to format time as "HH:mm:ss.SSS'Z'"
function getEventTime(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return "";
  try {
    const parsed = parse(
      `${dateStr} ${timeStr}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    return format(parsed, "HH:mm:ss.SSS'Z'");
  } catch {
    return "";
  }
}

const EditBookingPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const { data, loading, error } = useQuery(GET_EVENT_BY_ID_OWNER, {
    variables: { id: eventId },
    client: apolloClientPartner,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      customerName: "",
      contactNumber: "",
      location: "",
      eventDate: "",
      eventStart: "",
      eventEnd: "",
      customizations: "",
      customizationsPrice: "",
      eventStatus: "",
      obtainmentMethod: "",
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.getEventsById) {
      const event = data.getEventsById;
      // Parse eventStart and eventEnd if available
      let eventStart = "";
      let eventEnd = "";
      if (event.eventStart) {
        const [h, m] = event.eventStart.split(":");
        eventStart = h && m ? `${h}:${m}` : "";
      }
      if (event.eventEnd) {
        const [h, m] = event.eventEnd.split(":");
        eventEnd = h && m ? `${h}:${m}` : "";
      }
      reset({
        customerName: event.customer
          ? `${event.customer.firstName} ${event.customer.lastName}`
          : "",
        contactNumber: event.customer?.contactNumber || "",
        location: event.eventAddress || event.location || "",
        eventDate: event.eventDate
          ? new Date(event.eventDate).toISOString().split("T")[0]
          : "",
        eventStart,
        eventEnd,
        customizations: event.customizations || "",
        customizationsPrice: event.customizationsPrice || "",
        eventStatus: event.eventStatus || "",
        obtainmentMethod: event.minjeeVenue ? "true" : "false",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      const event_start = getEventTime(formData.eventDate, formData.eventStart);
      const event_end = getEventTime(formData.eventDate, formData.eventEnd);

      const patchBody = {
        name: formData.customerName,
        event_address: formData.location,
        event_date: formData.eventDate,
        event_start,
        event_end,
        customizations: formData.customizations,
        customizations_price: Number(formData.customizationsPrice) || 0,
        event_status: formData.eventStatus,
        minjee_venue: formData.obtainmentMethod === "true",
      };

      await api.patch(
        `http://localhost:8000/api/v1/o/events/${eventId}`,
        patchBody
      );

      toast.success("Event booking updated successfully!");
      router.push(`/bookings`);
    } catch (err) {
      console.error("Failed to update event booking:", err);
      toast.error("Failed to update event booking.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading event booking.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center">
        <div className="bg-white w-[800px] rounded-lg border border-neutral-200 px-12 py-8">
          <div className="flex gap-x-3 items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <MoveLeft width={20} height={20} className="text-neutral-600" />
            </button>
            <div className="flex justify-between items-center w-full">
              <h1 className="font-afacad_medium text-3xl pl-3 ml-1">
                Edit Event Booking
              </h1>
              <StatusLabel
                label={data?.getEventsById?.eventStatus || "Pending"}
              />
            </div>
          </div>

          {/* Customer Information */}
          <div className="mt-12">
            <div>
              <h1 className="font-afacad text-neutral-500">
                Customer Information
              </h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Customer Name</h1>
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        readOnly
                      />
                    )}
                  />
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Contact Number</h1>
                  <Controller
                    name="contactNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-sm text-neutral-500">Event Address</h1>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-neutral-100/50 w-full h-12 px-5"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Booking Schedule */}
          <div className="mt-12">
            <div>
              <h1 className="font-afacad text-neutral-500">Event Schedule</h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Event Date</h1>
                  <Controller
                    name="eventDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="date"
                      />
                    )}
                  />
                </div>
                <div>
                  <h1 className="text-sm text-neutral-500">Event Start Time</h1>
                  <Controller
                    name="eventStart"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="time"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div>
                  <h1 className="text-sm text-neutral-500">Event End Time</h1>
                  <Controller
                    name="eventEnd"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="bg-neutral-100/50 w-80 h-12 px-5"
                        type="time"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customizations */}
          <div className="mt-12">
            <div>
              <h1 className="font-afacad text-neutral-500">Customizations</h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">Customizations</h1>
                <Controller
                  name="customizations"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="bg-neutral-100/50 w-full h-20 px-5"
                    />
                  )}
                />
              </div>
              <div>
                <h1 className="text-sm text-neutral-500">Customization Price</h1>
                <Controller
                  name="customizationsPrice"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-neutral-100/50 w-full h-12 px-5"
                      type="number"
                      min="0"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Obtainment Method */}
          {/* <div>
            <h1 className="text-sm text-neutral-500">Venue</h1>
            <Controller
              name="obtainmentMethod"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-80 h-12 bg-neutral-100/50 px-5">
                    <SelectValue placeholder="Select Venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {obtainmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div> */}

          {/* Event Status */}
          <div className="mt-6">
            <div>
              <h1 className="font-afacad text-neutral-500">Event Status</h1>
              <hr />
            </div>
            <div className="pt-6 pb-10 space-y-6">
              <div>
                <h1 className="text-sm text-neutral-500">
                  Select Status for this event
                </h1>
                <Controller
                  name="eventStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-80 h-12 bg-neutral-100/50 px-5">
                        <SelectValue placeholder="Select event status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="font-afacad">
                          {eventStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 flex justify-end">
            <Button
              type="submit"
              className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6"
              disabled={isSubmitting}
            >
              Finalize Booking
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditBookingPage;