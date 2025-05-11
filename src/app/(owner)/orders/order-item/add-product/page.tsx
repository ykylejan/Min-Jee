import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, X } from "lucide-react";
import { ProductsDataSample } from "@/constants";
import Image from "next/image";

const page = () => {
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
              <Input className="pl-10" placeholder="Search products..." />
            </div>
            <Select defaultValue="all">
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
            {ProductsDataSample.map((data) => (
            <Card key={data.id} className="overflow-hidden">
              <div className="bg-gray-100 h-32 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-camouflage-200 w-20 h-20 rounded-md flex items-center justify-center overflow-hidden">
                    <Image src={data.image.src} alt="product_item" layout="fill" objectFit="cover" />
                    </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-afacad_medium text-lg mb-1">{data.name} </h3>
                <p className="text-gray-600 text-sm mb-2">{data.category} </p>
                <div className="flex justify-between items-center">
                    <p className="font-afacad_medium">Php {data.price.toFixed(2)}</p>
                  <Button size="sm" className="bg-camouflage-400 hover:bg-camouflage-400/80">
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
              
              {/* Selected product*/}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex-1">
                    <h3 className="font-afacad_medium">Half-Sized Food Warmer</h3>
                    <p className="text-sm text-gray-600">PHP 10.00</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="h-7 w-7 border-gray-300">
                        -
                      </Button>
                      <Input className="w-12 h-7 text-center mx-1" defaultValue="1" />
                      <Button variant="outline" size="icon" className="h-7 w-7 border-gray-300">
                        +
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between font-afacad_medium text-lg mb-6">
                  <span>Total</span>
                  <span>PHP 25.00</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Link href="/orders/order-item">
                  <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad w-full">
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

export default page;