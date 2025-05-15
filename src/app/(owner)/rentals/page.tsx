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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import StockStatus from "@/components/OwnerPage/Products/StockStatus";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES, GET_ALL_RENTALS } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

interface RentalTypes {
  id: string;
  categoryId: string;
  img: string;
  name: string;
  price: number;
  currentQuantity: number;
  totalQuantity: number;
}

const Page = () => {
  const router = useRouter();
  const [rentals, setRentals] = useState<RentalTypes[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { loading, error, data } = useQuery(GET_ALL_RENTALS, {
    client: apolloClient,
  });

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryData,
  } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
  });

  useEffect(() => {
    if (data?.getRentals && categoryData?.getCategories) {
      // console.log("DATA:", data.getRentals);
      setCategories(categoryData.getCategories);
      setRentals(data.getRentals);
    }
  }, [data, categoryData]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleRowClick = (id: string) => {
    router.push(`/rentals/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="font-afacad font-light text-2xl">
            All Rentals
            <CardDescription className="text-base">
              This table shows all the rentals available in the system.
            </CardDescription>
          </div>

          <div className="flex gap-x-3">
            <div className="relative w-fit">
              <Input
                placeholder="Search an order item"
                className="w-fit font-light pr-8"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <Button
              className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              onClick={() => router.push("/rentals/add-rental")}
            >
              <Plus />
              Add Rental
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Rental Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow
                key={rental.id}
                className="hover:cursor-pointer"
                onClick={() => handleRowClick(rental.id)}
              >
                <TableCell className="font-medium">{rental.name}</TableCell>
                <TableCell>{getCategoryName(rental.categoryId)}</TableCell>
                <TableCell>PHP {rental.price}</TableCell>
                <TableCell>{rental.currentQuantity}/{rental.totalQuantity}</TableCell>
                <TableCell>
                  <StockStatus
                    status={rental.currentQuantity <= rental.totalQuantity * 0.1 ? "Out of Stock" : "In Stock"}
                  />
                </TableCell>
                <TableCell className="hover:underline cursor-pointer">
                  Edit
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
};

export default Page;
