"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
import {
  FormPageLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/OwnerPage";
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

  const eventStatus = data?.getEventsById?.eventStatus || "Pending";

  return (
    <FormPageLayout
      title="Edit Event Booking"
      status={eventStatus}
      isLoading={loading}
      loadingText="Loading booking details..."
      error={error ? "Error loading event booking." : null}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Customer Information */}
        <FormSection title="Customer Information">
          <div className="space-y-4">
            <FormRow>
              <FormField label="Customer Name">
                <Controller
                  name="customerName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-gray-50 h-11 px-4"
                      readOnly
                    />
                  )}
                />
              </FormField>
              <FormField label="Contact Number">
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-gray-50 h-11 px-4"
                    />
                  )}
                />
              </FormField>
            </FormRow>
            <FormField label="Event Address">
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="bg-gray-50 h-11 px-4 w-full"
                  />
                )}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Event Schedule */}
        <FormSection title="Event Details">
          <div className="space-y-4">
            <FormRow>
              <FormField label="Event Date">
                <Controller
                  name="eventDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-gray-50 h-11 px-4"
                      type="date"
                    />
                  )}
                />
              </FormField>
              <FormField label="Event Start Time">
                <Controller
                  name="eventStart"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-gray-50 h-11 px-4"
                      type="time"
                    />
                  )}
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField label="Event End Time">
                <Controller
                  name="eventEnd"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="bg-gray-50 h-11 px-4"
                      type="time"
                    />
                  )}
                />
              </FormField>
              <div></div>
            </FormRow>
          </div>
        </FormSection>

        {/* Customizations */}
        <FormSection title="Additional Details">
          <div className="space-y-4">
            <FormField label="Customizations">
              <Controller
                name="customizations"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="bg-gray-50 min-h-[80px] px-4 py-3"
                  />
                )}
              />
            </FormField>
            <FormField label="Customization Price">
              <Controller
                name="customizationsPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="bg-gray-50 h-11 px-4"
                    type="number"
                    min="0"
                  />
                )}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Event Status */}
        <FormSection title="Event Status">
          <FormField label="Select Status for this event">
            <Controller
              name="eventStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-gray-50 h-11 px-4 max-w-xs">
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
          </FormField>
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white font-afacad px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Finalize Booking"
            )}
          </Button>
        </FormActions>
      </form>
    </FormPageLayout>
  );
};

export default EditBookingPage;