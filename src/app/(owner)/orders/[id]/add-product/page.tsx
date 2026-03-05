"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Search, X, Loader2, Package, Wrench, ShoppingCart } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ALL_RENTALS, GET_SERVICES_WITH_ITEMS } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";
import api from "@/app/utils/api";
import { toast } from "sonner";

interface RentalItem {
  id: string;
  name: string;
  img: string;
  price: number;
  currentQuantity: number;
  totalQuantity: number;
  categoryId: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
  serviceId: string;
}

interface ServiceWithItems {
  id: string;
  name: string;
  img: string;
  serviceItems: ServiceItem[];
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "rental" | "service";
  img?: string;
  serviceName?: string;
}

const AddProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch rentals
  const {
    data: rentalsData,
    loading: rentalsLoading,
  } = useQuery(GET_ALL_RENTALS, {
    client: apolloClient,
  });

  // Fetch services with items
  const {
    data: servicesData,
    loading: servicesLoading,
  } = useQuery(GET_SERVICES_WITH_ITEMS, {
    client: apolloClient,
  });

  const rentals: RentalItem[] = rentalsData?.getRentals || [];
  const services: ServiceWithItems[] = servicesData?.getServicesWithItems || [];

  // Flatten service items for display
  const serviceItems: (ServiceItem & { serviceName: string; img: string })[] = services.flatMap(
    (service) =>
      service.serviceItems.map((item) => ({
        ...item,
        serviceName: service.name,
        img: service.img,
      }))
  );

  // Filter products based on search and category
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch = rental.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || categoryFilter === "rentals";
    return matchesSearch && matchesCategory;
  });

  const filteredServiceItems = serviceItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || categoryFilter === "services";
    return matchesSearch && matchesCategory;
  });

  // Add product to selection
  const addProduct = (product: SelectedProduct) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id && p.type === product.type);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id && p.type === product.type
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove product from selection
  const removeProduct = (productId: string, type: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => !(p.id === productId && p.type === type))
    );
  };

  // Update product quantity
  const updateQuantity = (productId: string, type: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId && p.type === type ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  // Calculate total
  const totalPrice = selectedProducts.reduce(
    (total, p) => total + p.price * p.quantity,
    0
  );

  // Submit products to order
  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    setIsSubmitting(true);

    try {
      const rentalsToAdd = selectedProducts.filter((p) => p.type === "rental");
      const servicesToAdd = selectedProducts.filter((p) => p.type === "service");

      // Add rentals
      for (const rental of rentalsToAdd) {
        await api.post(`/o/order/${orderId}/rentals`, {
          rental_id: rental.id,
          rental_quantity: rental.quantity,
          rental_total: rental.price * rental.quantity,
          order_item_status: "reserved",
        });
      }

      // Add services
      for (const service of servicesToAdd) {
        await api.post(`/o/order/${orderId}/services`, {
          service_items_id: service.id,
          service_quantity: service.quantity,
          service_total: service.price * service.quantity,
        });
      }

      toast.success("Products added to order successfully!");
      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      console.error("Failed to add products:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to add products. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = rentalsLoading || servicesLoading;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="border-gray-200 shadow-sm max-w-6xl mx-auto">
        <CardHeader className="border-b border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <Link href={`/orders/${orderId}`}>
              <Button variant="ghost" className="p-2 h-10 w-10">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="font-afacad_medium text-2xl sm:text-3xl">
                Add Products to Order
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Order ID: {orderId?.slice(0, 8)}...
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 animate-spin text-camouflage-400 mb-4" />
              <p className="text-gray-500 font-medium">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Product List */}
              <div className="lg:col-span-2">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <Input
                      className="pl-10 bg-gray-50 h-11"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-44 bg-gray-50 h-11">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="rentals">Rentals Only</SelectItem>
                      <SelectItem value="services">Services Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rentals Section */}
                {(categoryFilter === "all" || categoryFilter === "rentals") &&
                  filteredRentals.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-camouflage-500" />
                        <h2 className="font-afacad_medium text-lg">Rentals</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredRentals.map((rental) => (
                          <Card key={rental.id} className="overflow-hidden border-gray-200">
                            <div className="bg-gray-100 h-32 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                {rental.img ? (
                                  <Image
                                    src={rental.img}
                                    alt={rental.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="bg-camouflage-200 w-20 h-20 rounded-md flex items-center justify-center">
                                    <Package className="w-8 h-8 text-camouflage-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-afacad_medium text-lg mb-1 truncate">
                                {rental.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                Stock: {rental.currentQuantity}/{rental.totalQuantity}
                              </p>
                              <div className="flex justify-between items-center">
                                <p className="font-afacad_medium">
                                  ₱{Number(rental.price).toFixed(2)}
                                </p>
                                <Button
                                  size="sm"
                                  className="bg-camouflage-400 hover:bg-camouflage-400/80"
                                  onClick={() =>
                                    addProduct({
                                      id: rental.id,
                                      name: rental.name,
                                      price: Number(rental.price),
                                      quantity: 1,
                                      type: "rental",
                                      img: rental.img,
                                    })
                                  }
                                  disabled={rental.currentQuantity <= 0}
                                >
                                  Add
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Services Section */}
                {(categoryFilter === "all" || categoryFilter === "services") &&
                  filteredServiceItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Wrench className="w-5 h-5 text-camouflage-500" />
                        <h2 className="font-afacad_medium text-lg">Services</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredServiceItems.map((item) => (
                          <Card
                            key={item.id}
                            className="overflow-hidden border-gray-200"
                          >
                            <div className="bg-gray-100 h-32 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                {item.img ? (
                                  <Image
                                    src={item.img}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="bg-camouflage-200 w-20 h-20 rounded-md flex items-center justify-center">
                                    <Wrench className="w-8 h-8 text-camouflage-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-afacad_medium text-lg mb-1 truncate">
                                {item.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 truncate">
                                {item.serviceName}
                              </p>
                              <div className="flex justify-between items-center">
                                <p className="font-afacad_medium">
                                  ₱{Number(item.price).toFixed(2)}
                                </p>
                                <Button
                                  size="sm"
                                  className="bg-camouflage-400 hover:bg-camouflage-400/80"
                                  onClick={() =>
                                    addProduct({
                                      id: item.id,
                                      name: item.name,
                                      price: Number(item.price),
                                      quantity: 1,
                                      type: "service",
                                      img: item.img,
                                      serviceName: item.serviceName,
                                    })
                                  }
                                >
                                  Add
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                {/* No products */}
                {filteredRentals.length === 0 && filteredServiceItems.length === 0 && (
                  <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No products found matching your search.</p>
                  </div>
                )}
              </div>

              {/* Selected Products Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 border-gray-200">
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="font-afacad_medium text-xl mb-4">
                      Selected Products
                    </h2>

                    {/* Selected products list */}
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {selectedProducts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                          No products selected
                        </p>
                      ) : (
                        selectedProducts.map((product) => (
                          <div
                            key={`${product.type}-${product.id}`}
                            className="flex justify-between items-center border-b border-gray-100 pb-3"
                          >
                            <div className="flex-1 min-w-0 mr-2">
                              <h3 className="font-afacad_medium truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                ₱{product.price.toFixed(2)} × {product.quantity}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  product.type === "rental"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {product.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 border-gray-300"
                                  onClick={() =>
                                    updateQuantity(
                                      product.id,
                                      product.type,
                                      product.quantity - 1
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center text-sm">
                                  {product.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 border-gray-300"
                                  onClick={() =>
                                    updateQuantity(
                                      product.id,
                                      product.type,
                                      product.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeProduct(product.id, product.type)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-afacad_medium text-lg mb-6">
                        <span>Total</span>
                        <span>₱{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-col gap-3">
                      <Button
                        className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad w-full h-11"
                        disabled={selectedProducts.length === 0 || isSubmitting}
                        onClick={handleSubmit}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add to Order"
                        )}
                      </Button>
                      <Link href={`/orders/${orderId}`} className="w-full">
                        <Button
                          variant="outline"
                          className="border-camouflage-400 text-camouflage-400 hover:bg-camouflage-50 font-afacad w-full h-11"
                        >
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;
