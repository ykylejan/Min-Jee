"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Plus, Cake, Loader2, ImageOff, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENT_PACKAGES } from "@/graphql/people";
import apolloClient from "@/graphql/apolloClient";
import { PageHeader, StatsCard, Pagination } from "@/components/OwnerPage";

const ITEMS_PER_PAGE = 8;

interface EventPackage {
  id: string;
  name: string;
  img?: string;
}

const EventsPage: React.FC = () => {
  const router = useRouter();
  const [eventPackages, setEventPackages] = useState<EventPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading: packagesLoading,
    error: packagesError,
    data: packagesData,
  } = useQuery(GET_ALL_EVENT_PACKAGES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    try {
      if (packagesData?.getEventPackages) {
        setEventPackages(packagesData.getEventPackages);
      }
    } catch (error) {
      toast.error("Failed to fetch event packages.");
    }
  }, [packagesData, packagesLoading]);

  const { filteredPackages, stats } = useMemo(() => {
    const filtered = eventPackages.filter((pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      filteredPackages: filtered,
      stats: {
        total: eventPackages.length,
      },
    };
  }, [eventPackages, searchTerm]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          title="Total Packages"
          value={stats.total}
          icon={<Package className="w-5 h-5" />}
        />
        <StatsCard
          title="Event Types"
          value={stats.total}
          description="Available event packages"
          icon={<Cake className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Event Packages"
        description="Click on a package card to view or edit details"
        searchPlaceholder="Search packages..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionLabel="Add Package"
        actionIcon={<Plus className="w-4 h-4" />}
        onAction={() => router.push("/events/add-event")}
      />

      {/* Content */}
      {packagesLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-camouflage-400 mb-4" />
          <p className="text-gray-500">Loading event packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Cake className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No packages found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Get started by adding your first event package."}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => router.push("/events/add-event")}
                className="bg-camouflage-400 hover:bg-camouflage-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Package
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedPackages.map((pkg: EventPackage) => (
            <Card
              key={pkg.id}
              className="overflow-hidden cursor-pointer group border-gray-200 hover:border-camouflage-300 hover:shadow-lg transition-all duration-300"
              onClick={() => router.push(`/events/${pkg.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {pkg.img ? (
                  <img
                    src={pkg.img}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-camouflage-50 to-camouflage-100">
                    <Cake className="w-12 h-12 text-camouflage-300" />
                  </div>
                )}
                <Badge className="absolute top-3 right-3 bg-camouflage-400/90 backdrop-blur-sm hover:bg-camouflage-500">
                  Package
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="font-afacad_semibold text-lg line-clamp-1 group-hover:text-camouflage-600 transition-colors">
                  {pkg.name}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2 min-h-[2.5rem]">
                  Comprehensive {pkg.name.toLowerCase()} event package with all
                  services included.
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="text-sm text-gray-500">Click for details</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-camouflage-600 hover:bg-camouflage-50 -mr-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    router.push(`/events/${pkg.id}`);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!packagesLoading && filteredPackages.length > 0 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPackages.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </div>
  );
};

export default EventsPage;
