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
import { Search } from "lucide-react";

const page = () => {
    const router = useRouter();
    const handleRowClick = (id: string) => {
        router.push(`/orders/${id}`);
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <div className="font-afacad font-light text-2xl">
                            Order List
                            <CardDescription className="text-base">
                                Click an order row to view its details.
                            </CardDescription>
                        </div>

                        <div className="relative w-fit">
                            <Input placeholder="Search an order item" className="w-fit font-light pr-8" />
                            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>

                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <Table>
                        <TableCaption>
                            A list of your recent invoices.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Order ID</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Date Ordered</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                className="hover:cursor-pointer"
                                onClick={() => handleRowClick("order-item")}
                            >
                                <TableCell className="font-medium">REF 10223</TableCell>
                                <TableCell>Kyle Dellatan</TableCell>
                                <TableCell>Dec. 15, 2024</TableCell>
                                <TableCell>164/200</TableCell>
                                <TableCell className="flex justify-center">

                                    <div className="bg-[#FFE4B9] border border-[#FEC15F] w-fit px-4 py-2 rounded-lg">
                                        <h1 className="text-[#FF9D00] font-interbold">Pending</h1>
                                    </div>

                                </TableCell>
                            </TableRow>
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
