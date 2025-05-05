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
import { Plus, Search, Tags, UserRoundPlus } from "lucide-react";
import OnlineStatus from "@/components/OwnerPage/Customer/OnlineStatus";
import { useQuery } from "@apollo/client";
import { toast } from "sonner";
import { GET_ALL_CUSTOMERS } from "@/graphql/people";
import apolloClientPartner from "@/graphql/apolloClientPartners";

interface CustomerTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  bookings: number;
  isActive: boolean;
}

const page = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRowClick = (id: string) => {
    router.push(`/customers/${id}`);
  };

  const {
    loading: customersLoading,
    error: customersError,
    data: customersData,
  } = useQuery(GET_ALL_CUSTOMERS, {
    client: apolloClientPartner,
    fetchPolicy: "network-only",
  });

  useEffect(() => {

    console.log("Customer data:", customersData);
    

    try {
      if (customersData?.getCustomers) {
        setCustomers(customersData.getCustomers);
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching customer data. Please try again later."
      );
    }
  }, [customersData, customersLoading]);

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactNumber.includes(searchTerm)
    );
  });

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="font-afacad font-light text-2xl">
              Customer Lists
              <CardDescription className="text-base">
                Click a customer row to view/edit customer details.
              </CardDescription>
            </div>

            <div className="flex gap-x-3">
              <div className="relative w-fit">
                <Input
                  placeholder="Search customers"
                  className="w-fit font-light pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>

              <Button
                onClick={() => router.push("/customers/add-customer")}
                className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad"
              >
                <UserRoundPlus />
                Add Customer
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:cursor-pointer"
                  onClick={() => handleRowClick(customer.id)}
                >
                  <TableCell className="font-medium">
                    {`${customer.firstName} ${customer.lastName}`}
                  </TableCell>
                  <TableCell>{customer.contactNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-3 text-neutral-500">
                      <Tags size={18} />
                      <h1>{customer.bookings}</h1>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <OnlineStatus
                      status={customer.isActive ? "Active" : "Inactive"}
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
    </>
  );
};

export default page;
