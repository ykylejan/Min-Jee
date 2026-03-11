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
import { Plus, Tag, HandPlatter, Loader2, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery } from "@apollo/client";
import { GET_ALL_SERVICES } from "@/graphql/catalog";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";
import { PageHeader, StatsCard, Pagination } from "@/components/OwnerPage";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

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
  img?: string;
}

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

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
      toast.error("Failed to fetch categories. Please try again.");
    }
  }, [categoriesData, categoriesLoading]);

  useEffect(() => {
    try {
      if (servicesData?.getServices) {
        const processedServices: Service[] = servicesData.getServices.map(
          (service: Service) => ({
            ...service,
            categoryId:
              service.categoryId ||
              (categories.length > 0
                ? categories[Math.floor(Math.random() * categories.length)].id
                : undefined),
          })
        );
        setServices(processedServices);
      }
    } catch (error) {
      toast.error("Failed to fetch services. Please try again.");
    }
  }, [servicesData, servicesLoading, categories]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const { filteredServices, stats } = useMemo(() => {
    const filtered = services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? service.categoryId === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });

    const stats = {
      total: services.length,
      categories: new Set(services.map((s) => s.categoryId)).size,
    };

    return { filteredServices: filtered, stats };
  }, [services, searchTerm, selectedCategory]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isLoading = servicesLoading || categoriesLoading;

  return (
    <div className="space-y-3">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatsCard
          title="Total Services"
          value={stats.total}
          icon={<HandPlatter className="w-5 h-5" />}
        />
        <StatsCard
          title="Categories"
          value={stats.categories}
          icon={<Tag className="w-5 h-5" />}
        />
      </div>

      {/* Page Header */}
      <PageHeader
        title="Services"
        description="Click on a service card to view or edit details"
        searchPlaceholder="Search services..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        actionLabel="Add Service"
        actionIcon={<Plus className="w-4 h-4" />}
        onAction={() => router.push("/services/add-service")}
      />

      {/* Category Filter */}
      {!isLoading && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
            className={cn(
              "transition-all",
              selectedCategory === "" &&
                "bg-camouflage-400 hover:bg-camouflage-500 shadow-sm"
            )}
          >
            All Services
          </Button>
          {categories.map((category: Category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "transition-all",
                selectedCategory === category.id &&
                  "bg-camouflage-400 hover:bg-camouflage-500 shadow-sm"
              )}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-camouflage-400 mb-4" />
          <p className="text-gray-500">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <HandPlatter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first service."}
            </p>
            {!searchTerm && !selectedCategory && (
              <Button
                onClick={() => router.push("/services/add-service")}
                className="bg-camouflage-400 hover:bg-camouflage-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Service
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedServices.map((service: Service) => (
            <Card
              key={service.id}
              className="overflow-hidden cursor-pointer group border-gray-200 hover:border-camouflage-300 hover:shadow-lg transition-all duration-300"
              onClick={() => router.push(`/services/${service.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {service.img ? (
                  <img
                    src={service.img}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {service.categoryId && (
                  <Badge className="absolute top-3 right-3 bg-camouflage-400/90 backdrop-blur-sm hover:bg-camouflage-500">
                    {getCategoryName(service.categoryId)}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="font-afacad_semibold text-lg line-clamp-1 group-hover:text-camouflage-600 transition-colors">
                  {service.name}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2 min-h-[2.5rem]">
                  {service.description ||
                    `Professional ${service.name.toLowerCase()} service for your events.`}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-camouflage-600">
                  <Tag className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">
                    {service.priceRange || "Contact for price"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-camouflage-600 hover:bg-camouflage-50 -mr-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    router.push(`/services/${service.id}`);
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
      {!isLoading && filteredServices.length > 0 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredServices.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
