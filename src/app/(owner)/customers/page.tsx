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


const page = () => {
    const router = useRouter();
    const handleRowClick = (id: string) => {
        router.push(`/products/${id}`);
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <div className="font-afacad font-light text-2xl">
                            Customer Lists
                            {/* <CardDescription className="text-base">
                                Click an order row to view its details.
                            </CardDescription> */}
                        </div>

                        <div className="flex gap-x-3">
                            <div className="relative w-fit">
                                <Input placeholder="Search an order item" className="w-fit font-light pr-8" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>

                            <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad">
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


                            {/* 5 rows is ideal */}
                            <TableRow
                                className="hover:cursor-pointer"
                            // onClick={() => handleRowClick("edit-product")}
                            >
                                <TableCell className="font-medium">Mario Inguito</TableCell>
                                <TableCell>0998 765 4321</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-x-3 text-neutral-500">
                                        <Tags size={18} />
                                        <h1>5</h1>
                                    </div>
                                </TableCell>
                                <TableCell>mario@gmail.com</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-x-3">
                                        <div className="rounded-full bg-[#A6E7D8] border border-[#008767] w-2 h-2" />
                                        <h1>Active</h1>
                                    </div>
                                </TableCell>
                                <TableCell className="hover:underline cursor-pointer">Edit</TableCell>

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
