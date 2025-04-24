"use client";
import React from "react";
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Tag, Tags, UserRoundPlus } from "lucide-react";
import { AllCustomerSample, AllHistorySample, AllPartnerSample } from "@/constants";
import OnlineStatus from "@/components/OwnerPage/Customer/OnlineStatus";
import PaymentStatus from "@/components/OwnerPage/History/PaymentStatus";


const page = () => {
    const router = useRouter();
    const handleRowClick = (id: string) => {
        router.push(`/history/${id}`);
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <div className="font-afacad font-light text-2xl">
                            History List
                            <CardDescription className="text-base">
                                Click a row to expand the a customer's order history.
                            </CardDescription>
                        </div>

                        <div className="flex gap-x-3">
                            <div className="relative w-fit">
                                <Input placeholder="Search an order item" className="w-fit font-light pr-8" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>
                        </div>

                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Customer Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead> </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {/* 5 rows is ideal */}
                            {AllHistorySample.map((data) => (
                                <TableRow
                                    key={data.id}
                                    className="hover:cursor-pointer"
                                    onClick={() => handleRowClick("edit-customer")}
                                >
                                    <TableCell className="font-medium">{data.customerName}</TableCell>
                                    <TableCell>{data.phoneNumber}</TableCell>
                                    <TableCell>{data.catergory}</TableCell>
                                    <TableCell>
                                        <PaymentStatus status={data.paymentStatus} />
                                    </TableCell>
                                    <TableCell className="hover:underline cursor-pointer">View</TableCell>

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
