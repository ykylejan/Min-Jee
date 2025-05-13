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
import { Plus, Search, Tag, Tags, UserRoundPlus } from "lucide-react";
import { AllCustomerSample, AllPartnerSample } from "@/constants";
import OnlineStatus from "@/components/OwnerPage/Customer/OnlineStatus";
import { useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "@/graphql/products";
import { GET_ALL_PARTNERS } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";
import apolloClient from "@/graphql/apolloClient";
import { toast } from "sonner";

interface PartnerTypes {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  categoryId: string;
}

const page = () => {
  const router = useRouter();

  const [partners, setPartners] = useState<PartnerTypes[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleRowClick = (id: string) => {
    router.push(`/partners/${id}`);
  };

  const {
    loading: partnersLoading,
    error: partnersError,
    data: partnersData,
  } = useQuery(GET_ALL_PARTNERS, {
    client: apolloClientPartner,
    fetchPolicy: "network-only",
  });

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(GET_ALL_CATEGORIES, {
    client: apolloClient,
    fetchPolicy: "cache-and-network",
  });

  const getPartnerCategories = (categories: any[] = []) => {
    return categories.filter((category) => category.type === "Partner");
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  useEffect(() => {
    try {
      if (partnersData?.getPartner && categoriesData?.getCategories) {
        const partnerCategories = getPartnerCategories(
          categoriesData.getCategories
        );
        setCategories(partnerCategories);
        setPartners(partnersData.getPartner);
        console.log("DATA:", partnersData.getPartner);
        console.log("Categories:", categoriesData.getCategories);
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching data. Please try again later."
      );
    }
  }, [partnersData, partnersLoading, categoriesData, categoriesLoading]);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              Parnter List
              <CardDescription className="text-base">
                Click an order row to view/edit a partner details.
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
                onClick={() => router.push("/partners/add-partner")}
                className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              >
                <UserRoundPlus />
                Add Partner
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Partner Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Category</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 5 rows is ideal */}
              {partners.map((data) => (
                <TableRow
                  key={data.id}
                  className="hover:cursor-pointer"
                  onClick={() => handleRowClick(data.id.toString())}
                >
                  <TableCell className="font-medium">{data.name}</TableCell>
                  <TableCell>{data.address}</TableCell>
                  <TableCell>{data.contactNumber}</TableCell>
                  <TableCell>{getCategoryName(data.categoryId)}</TableCell>
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
    </>
  );
};

export default page;
