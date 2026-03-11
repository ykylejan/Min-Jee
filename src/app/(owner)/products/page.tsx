"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package } from "lucide-react";
import StockStatus from "@/components/OwnerPage/Products/StockStatus";
import { AllProductsSample } from "@/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/OwnerPage";

const ITEMS_PER_PAGE = 10;


const ProductsPage = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(AllProductsSample.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return AllProductsSample.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage]);

    const handleRowClick = (id: string) => {
        router.push(`/products/${id}`);
    };

    return (
        <div className="space-y-3">
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-afacad_semibold text-gray-900">
                                All Products
                            </CardTitle>
                            <p className="text-gray-500 text-sm mt-1">
                                Filter out categories (Rentals, Services, Events)
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="Search products..." 
                                    className="pl-10 w-full sm:w-64 bg-gray-50 h-10" 
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="bg-camouflage-400 hover:bg-camouflage-500 text-white shadow-sm shadow-camouflage-400/25">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => router.push("/products/add-rental")}>
                                        Rentals
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/products/add-service")}>
                                        Service
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/products/add-event")}>
                                        Event
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-medium text-gray-600">Product Name</TableHead>
                                    <TableHead className="font-medium text-gray-600">Category</TableHead>
                                    <TableHead className="font-medium text-gray-600">Price</TableHead>
                                    <TableHead className="font-medium text-gray-600">Quantity</TableHead>
                                    <TableHead className="font-medium text-gray-600">Status</TableHead>
                                    <TableHead className="font-medium text-gray-600 w-20"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {AllProductsSample.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No products found</p>
                                                <p className="text-gray-400 text-sm">Add some products to get started</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedProducts.map((data) => (
                                        <TableRow
                                            key={data.id}
                                            className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                                            onClick={() => handleRowClick("edit-product")}
                                        >
                                            <TableCell className="font-medium text-gray-900">
                                                {data.productName}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {data.category}
                                            </TableCell>
                                            <TableCell className="text-gray-900 font-medium">
                                                ₱{data.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600">
                                                    {data.currentQuantity} / {data.maxQuantity}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {(() => {
                                                    const percentage = (data.currentQuantity / data.maxQuantity) * 100;
                                                    return <StockStatus status={percentage < 10 ? "Out of Stock" : "In Stock"} />;
                                                })()}
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-camouflage-600 hover:text-camouflage-700 hover:bg-camouflage-50"
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={AllProductsSample.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductsPage;
