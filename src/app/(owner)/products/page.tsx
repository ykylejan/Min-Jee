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
import { Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import StockStatus from "@/components/OwnerPage/Products/StockStatus";
import { AllProductsSample } from "@/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


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
                            All Products
                            <CardDescription className="text-base">
                                Filter out categories (Rentals, Services, Events)
                            </CardDescription>
                        </div>

                        <div className="flex gap-x-3">
                            <div className="relative w-fit">
                                <Input placeholder="Search an order item" className="w-fit font-light pr-8" />
                                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button className="bg-camouflage-400 hover:bg-camouflage-400/80 font-afacad">
                                        <Plus />
                                        Add Product
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="font-afacad">
                                    <DropdownMenuItem onClick={() => router.push("/products/add-rental")}>Rentals</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/products/add-service")}>Service</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/products/add-event")}>Event</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>


                        </div>

                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead> </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>


                            {/* 5 rows is ideal */}
                            {AllProductsSample.map((data) => (
                                <TableRow
                                    key={data.id}
                                    className="hover:cursor-pointer"
                                    onClick={() => handleRowClick("edit-product")}
                                >
                                    <TableCell className="font-medium">{data.productName}</TableCell>
                                    <TableCell>{data.category} </TableCell>
                                    <TableCell>PHP {data.price} </TableCell>
                                    <TableCell>{data.currentQuantity} / {data.maxQuantity} </TableCell>
                                    <TableCell>
                                        {(() => {
                                            const percentage = (data.currentQuantity / data.maxQuantity) * 100;
                                            return <StockStatus status={percentage < 10 ? "Out of Stock" : "In Stock"} />;
                                        })()}
                                    </TableCell>
                                    <TableCell className="hover:underline cursor-pointer">Edit</TableCell>
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
