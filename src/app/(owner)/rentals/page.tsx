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

interface CategoryTypes {
  id: string;
  name: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [rentals, setRentals] = useState<RentalTypes[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<RentalTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
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
      setCategories(categoryData.getCategories);
      setRentals(data.getRentals);
      setFilteredRentals(data.getRentals);
    }
  }, [data, categoryData]);

  // Handle search functionality
  useEffect(() => {
    if (rentals.length > 0) {
      const filtered = rentals.filter((rental) => 
        rental.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(rental.categoryId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.price.toString().includes(searchTerm)
      );
      setFilteredRentals(filtered);
    }
  }, [searchTerm, rentals]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleRowClick = (id: string): void => {
    router.push(`/rentals/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  if (loading || categoryLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (categoryError) return <p>Error loading categories: {categoryError.message}</p>;

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
                placeholder="Search a rental item"
                className="w-fit font-light pr-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <Button
              className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              onClick={() => router.push("/rentals/add-rental")}
            >
              <Plus className="mr-2" />
              Add Rental
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredRentals.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No rentals found matching your search criteria.
          </div>
        ) : (
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
              {filteredRentals.map((rental) => (
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
                  <TableCell 
                    className="hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(rental.id);
                    }}
                  >
                    Edit
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
};

export default Page;