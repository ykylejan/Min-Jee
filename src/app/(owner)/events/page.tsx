"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, UserRoundPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_ALL_EVENT_PACKAGES } from "@/graphql/people";
import apolloClient from "@/graphql/apolloClient";

interface EventPackage {
  id: string;
  name: string;
  img?: string;
}

const page: React.FC = () => {
  const router = useRouter();
  const [eventPackages, setEventPackages] = useState<EventPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      toast.error(
        "An error occurred while fetching event packages. Please try again later."
      );
    }
  }, [packagesData, packagesLoading]);

  const handleCardClick = (id: string): void => {
    router.push(`/events/${id}`);
  };

  // Filter packages based on search term
  const filteredPackages = eventPackages.filter((pkg) => {
    return pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              Event Packages
              <CardDescription className="text-base">
                Click on a package card to view/edit package details.
              </CardDescription>
            </div>

            <div className="flex gap-x-3">
              <div className="relative w-fit">
                <Input
                  placeholder="Search packages"
                  className="w-fit font-light pr-8"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>

              <Button
                onClick={() => router.push("/event-packages/add-package")}
                className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              >
                <UserRoundPlus className="mr-2" />
                Add Package
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {packagesLoading ? (
            <div className="flex justify-center items-center min-h-64">
              <p>Loading event packages...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="flex justify-center items-center min-h-64">
              <p>
                No packages found. Try adjusting your search or add a new
                package.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg: EventPackage) => (
                <Card
                  key={pkg.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(pkg.id)}
                >
                  <div className="relative">
                    <img
                      src={pkg.img || "/placeholder-event.jpg"}
                      alt={pkg.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-camouflage-400">
                      Package
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-afacad text-xl">
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {pkg.name} event package with comprehensive services.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">
                        Click for details
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleCardClick(pkg.id);
                      }}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default page;
