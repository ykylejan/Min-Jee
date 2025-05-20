"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, X } from "lucide-react";
import { ProductsDataSample } from "@/constants";
import Image from "next/image";

// Define TypeScript interfaces
interface ProductImage {
  src: string;
}

interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: ProductImage;
}

interface SelectedProduct extends Product {
  quantity: number;
}

const Page = () => {
  // State for search term
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // State for selected products
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  
  // Filter products based on search term and category
  const filteredProducts = ProductsDataSample.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  // Calculate total price of selected products
  const totalPrice = selectedProducts.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
  
  // Add product to selected products
  const addProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      // Check if product is already in the selected products
      const existingProductIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // If product already exists, increase its quantity
        const updatedProducts = [...prev];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + 1
        };
        return updatedProducts;
      } else {
        // If product doesn't exist, add it with quantity 1
        return [...prev, {...product, quantity: 1}];
      }
    });
  };
  
  // Remove product from selected products
  const removeProduct = (productId: string | number) => {
    setSelectedProducts((prev) => prev.filter(item => item.id !== productId));
  };
  
  // Update product quantity
  const updateQuantity = (productId: string | number, newQuantity: number) => {
    // Ensure quantity is at least 1
    const quantity = Math.max(1, newQuantity);
    
    setSelectedProducts((prev) => 
      prev.map(item => 
        item.id === productId ? {...item, quantity} : item
      )
    );
  };
  
  // Handle direct input of quantity
  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>, productId: string | number) => {
    const value = e.target.value;
    if (value === "" || isNaN(parseInt(value, 10))) return;
    
    updateQuantity(productId, parseInt(value, 10));
  };

  return (
    <div className="bg-white min-h-screen rounded-lg border border-neutral-200 px-12 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders/order-item">
          <Button variant="ghost" className="p-2">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="font-afacad_medium text-3xl">Add Products to Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                className="pl-10" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select 
              value={categoryFilter} 
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="rentals">Rentals</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="bg-gray-100 h-32 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-camouflage-200 w-20 h-20 rounded-md flex items-center justify-center overflow-hidden">
                      <Image src={product.image.src} alt="product_item" layout="fill" objectFit="cover" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-afacad_medium text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-afacad_medium">Php {product.price.toFixed(2)}</p>
                    <Button 
                      size="sm" 
                      className="bg-camouflage-400 hover:bg-camouflage-400/80"
                      onClick={() => addProduct(product)}
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side - Selected products */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="font-afacad_medium text-xl mb-4">Selected Products</h2>
              
              {/* Selected products list */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {selectedProducts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No products selected</p>
                ) : (
                  selectedProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-b pb-3">
                      <div className="flex-1">
                        <h3 className="font-afacad_medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">PHP {product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 border-gray-300"
                            onClick={() => updateQuantity(product.id, product.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input 
                            className="w-12 h-7 text-center mx-1" 
                            value={product.quantity}
                            onChange={(e) => handleQuantityInput(e, product.id)}
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7 border-gray-300"
                            onClick={() => updateQuantity(product.id, product.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeProduct(product.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between font-afacad_medium text-lg mb-6">
                  <span>Total</span>
                  <span>PHP {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link href="/orders/order-item">
                  <Button 
                    className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad w-full"
                    disabled={selectedProducts.length === 0}
                  >
                    Add to Order
                  </Button>
                </Link>
                <Link href="/orders/order-item">
                  <Button variant="outline" className="border-camouflage-400 text-camouflage-400 hover:bg-camouflage-50 font-afacad w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;