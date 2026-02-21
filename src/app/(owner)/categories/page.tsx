"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import apolloClient from "@/graphql/apolloClient";

interface CategoryTypes {
  id: string;
  name: string;
  type: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
  });

  useEffect(() => {
    if (data?.getCategories) {
      setCategories(data.getCategories);
      setFilteredCategories(data.getCategories);
    }
  }, [data]);

  useEffect(() => {
    if (categories.length > 0) {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleRowClick = (id: string): void => {
    router.push(`/categories/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="font-afacad font-light text-2xl">
            Categories
            <CardDescription className="text-base">
              Manage categories for rentals, partners, and other items.
            </CardDescription>
          </div>

          <div className="flex gap-x-3">
            <div className="relative w-fit">
              <Input
                placeholder="Search a category"
                className="w-fit font-light pr-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <Button
              className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              onClick={() => router.push("/categories/add-category")}
            >
              <Plus className="mr-2" />
              Add Category
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No categories found matching your search criteria.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className="hover:cursor-pointer"
                  onClick={() => handleRowClick(category.id)}
                >
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.type}</TableCell>
                  <TableCell
                    className="hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(category.id);
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
    </Card>
  );
};

export default Page;
