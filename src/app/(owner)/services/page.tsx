"use client";
import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Search, UserRoundPlus, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_ALL_SERVICES } from "@/graphql/catalog";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  priceRange?: string;
  categoryId?: string;
  imageUrl?: string;
}

const page: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const {
    loading: servicesLoading,
    error: servicesError,
    data: servicesData,
  } = useQuery(GET_ALL_SERVICES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    try {
      if (categoriesData?.getAllCategories) {
        setCategories(categoriesData.getAllCategories);
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching categories. Please try again later."
      );
    }
  }, [categoriesData, categoriesLoading]);

  useEffect(() => {
    try {
      if (servicesData?.getServices) {
        // Add placeholders for missing data
        const processedServices: Service[] = servicesData.getServices.map((service: Service) => ({
          ...service,
          imageUrl: `/api/placeholder/${600 + Math.floor(Math.random() * 100)}/${400 + Math.floor(Math.random() * 100)}`,
          // Use the service name to generate a semi-random category if none exists
          categoryId: service.categoryId || (categories.length > 0 ? 
            categories[Math.floor(Math.random() * categories.length)].id : undefined)
        }));
        setServices(processedServices);
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching services. Please try again later."
      );
    }
  }, [servicesData, servicesLoading, categories]);

  const handleCardClick = (id: string): void => {
    router.push(`/services/${id}`);
  };

  // Filter services based on search term and selected category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? service.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Find category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              Services
              <CardDescription className="text-base">
                Click on a service card to view/edit service details.
              </CardDescription>
            </div>

            <div className="flex gap-x-3">
              <div className="relative w-fit">
                <Input
                  placeholder="Search services"
                  className="w-fit font-light pr-8"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>

              <Button
                onClick={() => router.push("/services/add-service")}
                className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              >
                <UserRoundPlus className="mr-2" />
                Add Service
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!servicesLoading && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button 
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
                className="mb-2"
              >
                All
              </Button>
              {categories.map((category: Category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="mb-2"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}

          {servicesLoading || categoriesLoading ? (
            <div className="flex justify-center items-center min-h-6  4">
              <p>Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex justify-center items-center min-h-64">
              <p>No services found. Try adjusting your search or add a new service.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service: Service) => (
                <Card 
                  key={service.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(service.id)}
                >
                  <div className="relative">
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className="w-full h-48 object-cover"
                    />
                    {service.categoryId && (
                      <Badge className="absolute top-2 right-2 bg-camouflage-400">
                        {getCategoryName(service.categoryId)}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-afacad text-xl">{service.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {service.description || `${service.name} service provided by our expert team.`}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">{service.priceRange || "Contact for pricing"}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleCardClick(service.id);
                    }}>
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default page;