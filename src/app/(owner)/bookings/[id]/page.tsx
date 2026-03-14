"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  MoveLeft,
  Pencil,
  Phone,
  Sparkles,
  Ticket,
  UserRound,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/OwnerPage";
import { GET_EVENT_BY_ID_OWNER } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value || 0);

const formatDate = (value?: string) => {
  if (!value) return "Not scheduled";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "Not scheduled";

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return "Not set";

  const parsedTime = new Date(`1970-01-01T${value}`);
  if (Number.isNaN(parsedTime.getTime())) return "Not set";

  return parsedTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getDaysLabel = (value?: string) => {
  if (!value) return "No date";

  const eventDate = new Date(value);
  if (Number.isNaN(eventDate.getTime())) return "No date";

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const eventStart = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );
  const diffDays = Math.round(
    (eventStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "In 1 day";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "1 day ago";

  return `${Math.abs(diffDays)} days ago`;
};

const getDurationLabel = (start?: string, end?: string) => {
  if (!start || !end) return "Time not complete";

  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);

  if (
    Number.isNaN(startTime.getTime()) ||
    Number.isNaN(endTime.getTime()) ||
    endTime <= startTime
  ) {
    return "Time not complete";
  }

  const minutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) return `${hours}h ${remainingMinutes}m`;
  if (hours) return `${hours}h`;

  return `${remainingMinutes}m`;
};

const getPaymentTone = (status?: string) => {
  const normalizedStatus = status?.toLowerCase() || "pending";

  if (normalizedStatus === "paid") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalizedStatus === "partial") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalizedStatus === "failed" || normalizedStatus === "rejected") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-stone-200 bg-stone-50 text-stone-700";
};

type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-3.5">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-camouflage-50 text-camouflage-700">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <div className="mt-1 text-sm text-stone-900">{value}</div>
    </div>
  </div>
);

type MetricCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: ReactNode;
};

const MetricCard = ({ label, value, caption, icon }: MetricCardProps) => (
  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
        <p className="mt-1 font-afacad_semibold text-xl text-stone-900">{value}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-camouflage-700 shadow-sm">
        {icon}
      </div>
    </div>
    <p className="mt-2 text-xs text-stone-500">{caption}</p>
  </div>
);

const BookingDetailPage = () => {
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_EVENT_BY_ID_OWNER, {
    variables: { id: eventId },
    client: apolloClientPartner,
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-camouflage-100 text-camouflage-700 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h2 className="mt-5 font-poppins_bold text-2xl text-stone-900">
          Loading booking details
        </h2>
        <p className="mt-2 max-w-md text-stone-500">
          Pulling the event overview, customer information, and pricing summary.
        </p>
      </div>
    );
  }

  if (error || !data?.getEventsById) {
    return (
      <Card className="mx-auto max-w-3xl border-red-200 bg-red-50/80 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-5 font-poppins_bold text-2xl text-red-900">
            Booking details are unavailable
          </h3>
          <p className="mt-2 max-w-md text-red-700/80">
            The booking could not be loaded right now. Go back to the list and try again.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-red-300 bg-white text-red-700 hover:bg-red-100"
            >
              <MoveLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
            <Button asChild className="bg-red-600 text-white hover:bg-red-700">
              <Link href="/bookings">View bookings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const event = data.getEventsById;
  const customer = event.customer;
  const transaction = event.transactionDetails?.[0];
  const eventPackage = event.pax?.eventPackages;

  const eventPackageItem = eventPackage
    ? [
        {
          id: eventPackage.id,
          name: eventPackage.name,
          price: Number(event.pax?.price || 0),
          quantity: 1,
          subtitle: event.pax?.name ? `${event.pax.name} pax package` : "Event package",
          img: eventPackage.img,
          type: "Package",
        },
      ]
    : [];

  const addonItems = Array.isArray(event.addonsList)
    ? event.addonsList.map((entry: any) => ({
        id: entry.id || entry.addonsId,
        name: entry.addons?.name || "Add-on",
        price: Number(entry.addons?.price || 0),
        quantity: 1,
        subtitle: "Extra add-on",
        img: entry.addons?.img || null,
        type: "Add-on",
      }))
    : [];

  const selectedProducts = [...eventPackageItem, ...addonItems];
  const packagePrice = Number(event.pax?.price || 0);
  const addonsTotal = addonItems.reduce(
    (sum: number, addon: any) => sum + addon.price * addon.quantity,
    0
  );
  const customizationPrice = Number(event.customizationsPrice || 0);
  const totalPrice = packagePrice + addonsTotal + customizationPrice;
  const amountPaid = Number(transaction?.payment || 0);
  const remainingBalance = Math.max(totalPrice - amountPaid, 0);
  const eventDateLabel = formatDate(event.eventDate);
  const scheduleLabel = `${formatTime(event.eventStart)} - ${formatTime(event.eventEnd)}`;
  const durationLabel = getDurationLabel(event.eventStart, event.eventEnd);
  const venueLabel = event.minjeeVenue ? "Minjee Venue" : "Customer Venue";

  return (
    <div className="min-h-screen rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="border-stone-200 bg-stone-50 shadow-sm">
          <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <button
                      onClick={() => router.back()}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-700 transition hover:bg-stone-100"
                    >
                      <MoveLeft className="h-4 w-4" />
                      Back to previous view
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-stone-600">
                        <Ticket className="h-4 w-4" />
                        Booking #{event.id?.slice(0, 8) || "N/A"}
                      </span>
                      <StatusBadge
                        status={event.eventStatus || "Pending"}
                        size="lg"
                        className="shadow-none"
                      />
                    </div>

                    <div>
                      <p className="font-afacad_semibold uppercase tracking-[0.16em] text-xs text-camouflage-600">
                        Event Booking Details
                      </p>
                      <h1 className="mt-1.5 font-afacad_semibold text-2xl leading-tight text-stone-900 sm:text-3xl">
                        {event.name || "Untitled event"}
                      </h1>
                      <p className="mt-2 max-w-3xl text-sm text-stone-600 sm:text-base">
                        Built for quick review: schedule, customer context, booked items,
                        and payment progress are all in one place.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-camouflage-600" />
                        <span>{eventDateLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-camouflage-600" />
                        <span>{scheduleLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-camouflage-600" />
                        <span>{event.eventAddress || event.location || "Location pending"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
                    <Button
                      asChild
                      className="h-10 bg-camouflage-500 text-sm text-white hover:bg-camouflage-600"
                    >
                      <Link href={`/bookings/${eventId}/edit-booking`}>
                        <Pencil className="h-4 w-4" />
                        Edit booking
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 border-stone-300 bg-white text-sm text-stone-700 hover:bg-stone-100"
                    >
                      <Link href="/bookings">
                        View all bookings
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    label="Total value"
                    value={formatCurrency(totalPrice)}
                    caption={amountPaid > 0 ? `${formatCurrency(amountPaid)} paid so far` : "Awaiting payment activity"}
                    icon={<Wallet className="h-5 w-5" />}
                  />
                  <MetricCard
                    label="Attendees"
                    value={event.pax?.name || "Not set"}
                    caption={eventPackage?.name || "No package selected"}
                    icon={<UserRound className="h-5 w-5" />}
                  />
                  <MetricCard
                    label="Event timing"
                    value={durationLabel}
                    caption={`${formatTime(event.eventStart)} to ${formatTime(event.eventEnd)}`}
                    icon={<Clock3 className="h-5 w-5" />}
                  />
                  <MetricCard
                    label="Countdown"
                    value={getDaysLabel(event.eventDate)}
                    caption={venueLabel}
                    icon={<CalendarDays className="h-5 w-5" />}
                  />
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">
          <div className="space-y-6">
            <Card className="border-stone-200 bg-white/90 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Booking overview
                </CardTitle>
                <CardDescription className="text-sm">
                  The key operational details for the event schedule and venue.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <InfoRow
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Event date"
                  value={<span className="font-afacad_medium text-base">{eventDateLabel}</span>}
                />
                <InfoRow
                  icon={<Clock3 className="h-5 w-5" />}
                  label="Time window"
                  value={
                    <div>
                      <p className="font-afacad_medium text-base">{scheduleLabel}</p>
                      <p className="text-sm text-stone-500">Estimated duration: {durationLabel}</p>
                    </div>
                  }
                />
                <InfoRow
                  icon={<MapPin className="h-5 w-5" />}
                  label="Venue"
                  value={
                    <div>
                      <p className="font-afacad_medium text-base">{venueLabel}</p>
                      <p className="text-sm text-stone-500">
                        {event.eventAddress || event.location || "Address not provided yet"}
                      </p>
                    </div>
                  }
                />
                <InfoRow
                  icon={<Ticket className="h-5 w-5" />}
                  label="Booking status"
                  value={
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={event.eventStatus || "Pending"} />
                      <span className="text-sm text-stone-500">ID: {event.id || "N/A"}</span>
                    </div>
                  }
                />
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/90 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Included package and add-ons
                </CardTitle>
                <CardDescription className="text-sm">
                  Everything currently attached to this booking, priced and grouped.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProducts.length > 0 ? (
                  selectedProducts.map((product) => (
                    <div
                      key={`${product.type}-${product.id}`}
                      className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 sm:flex-row sm:items-center"
                    >
                      {product.img ? (
                        <img
                          src={product.img}
                          alt={product.name}
                          className="h-20 w-full rounded-lg object-cover sm:w-24"
                        />
                      ) : (
                        <div className="flex h-20 w-full items-center justify-center rounded-lg bg-camouflage-100 text-camouflage-700 sm:w-24">
                          <Sparkles className="h-6 w-6" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-afacad_semibold text-base text-stone-900">
                            {product.name}
                          </p>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                            {product.type}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">{product.subtitle}</p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                        <p className="text-xs text-stone-500">Qty {product.quantity}</p>
                        <p className="font-afacad_semibold text-base text-stone-900">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 text-stone-600">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-afacad_semibold text-lg text-stone-900">
                      No package or add-ons attached
                    </h3>
                    <p className="mt-2 text-stone-500">
                      This booking does not have any package selections or extra add-ons yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/90 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Customizations and requests
                </CardTitle>
                <CardDescription className="text-sm">
                  Notes from the booking plus any extra customization charges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                    Request details
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">
                    {event.customizations || "No custom requests were added for this booking."}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-camouflage-100 bg-camouflage-50/70 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-camouflage-700">
                      Customization charge
                    </p>
                    <p className="text-sm text-camouflage-700/80">
                      Applied on top of the base package and add-ons.
                    </p>
                  </div>
                  <p className="font-afacad_semibold text-lg text-camouflage-900">
                    {formatCurrency(customizationPrice)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/90 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Payment snapshot
                </CardTitle>
                <CardDescription className="text-sm">
                  Latest transaction activity recorded for this event booking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transaction ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoRow
                      icon={<Wallet className="h-5 w-5" />}
                      label="Amount received"
                      value={<span className="font-afacad_medium text-base">{formatCurrency(amountPaid)}</span>}
                    />
                    <InfoRow
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      label="Verification"
                      value={
                        <span className={transaction.isVerified ? "font-afacad_semibold text-emerald-700" : "font-afacad_semibold text-amber-700"}>
                          {transaction.isVerified ? "Verified payment" : "Awaiting verification"}
                        </span>
                      }
                    />
                    <InfoRow
                      icon={<CalendarDays className="h-5 w-5" />}
                      label="Transaction date"
                      value={<span className="font-afacad_medium text-base">{formatDate(transaction.date)}</span>}
                    />
                    <InfoRow
                      icon={<Ticket className="h-5 w-5" />}
                      label="Payment status"
                      value={
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium ${getPaymentTone(
                            transaction.paymentStatus
                          )}`}
                        >
                          {(transaction.paymentStatus || "Pending").toUpperCase()}
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 text-stone-600">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-afacad_semibold text-lg text-stone-900">
                      No payment record yet
                    </h3>
                    <p className="mt-2 text-stone-500">
                      Once a transaction is submitted, it will appear here with its status and verification state.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 xl:self-start">
            <Card className="border-stone-200 bg-white/95 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Customer details
                </CardTitle>
                <CardDescription className="text-sm">
                  Direct contact information for the booking owner.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-camouflage-100 bg-camouflage-50/70 p-4">
                  <p className="font-afacad_semibold text-lg text-stone-900">
                    {customer
                      ? `${customer.firstName} ${customer.lastName}`
                      : "No customer assigned"}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    Primary contact for event coordination.
                  </p>
                </div>

                <div className="space-y-3">
                  <InfoRow
                    icon={<Phone className="h-5 w-5" />}
                    label="Contact number"
                    value={customer?.contactNumber || "Not provided"}
                  />
                  <InfoRow
                    icon={<Mail className="h-5 w-5" />}
                    label="Email address"
                    value={customer?.email || "Not provided"}
                  />
                  <InfoRow
                    icon={<MapPin className="h-5 w-5" />}
                    label="Customer address"
                    value={customer?.address || "Not provided"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/95 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Pricing summary
                </CardTitle>
                <CardDescription className="text-sm">
                  A clean financial breakdown for quick approval checks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-stone-600">
                    <span>Event package</span>
                    <span className="font-medium text-stone-900">{formatCurrency(packagePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-stone-600">
                    <span>Add-ons</span>
                    <span className="font-medium text-stone-900">{formatCurrency(addonsTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-stone-600">
                    <span>Customization fee</span>
                    <span className="font-medium text-stone-900">{formatCurrency(customizationPrice)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-base text-stone-600">Grand total</span>
                      <span className="font-afacad_semibold text-xl text-stone-900">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">Amount paid</p>
                    <p className="mt-1 font-afacad_semibold text-xl text-stone-900">
                      {formatCurrency(amountPaid)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm text-amber-700">Remaining balance</p>
                    <p className="mt-1 font-afacad_semibold text-xl text-stone-900">
                      {formatCurrency(remainingBalance)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 bg-white/95 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-afacad_semibold text-xl text-stone-900">
                  Actions
                </CardTitle>
                <CardDescription className="text-sm">
                  Common next steps for managing this booking.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="h-10 w-full bg-camouflage-500 text-sm text-white hover:bg-camouflage-600">
                  <Link href={`/bookings/${eventId}/edit-booking`}>
                    <Pencil className="h-4 w-4" />
                    Update booking details
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-10 w-full border-stone-300 text-sm">
                  <Link href="/bookings">
                    <MoveLeft className="h-4 w-4" />
                    Back to bookings list
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
