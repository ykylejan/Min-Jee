"use client";

import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FormPageLayout,
    FormSection,
    FormField,
    FormRow,
    FormActions,
} from "@/components/OwnerPage";

interface ProductCardProps {
    category?: string;
    action?: string;
}

const ProductCard = ({ category, action }: ProductCardProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Add your submit logic here
        setTimeout(() => setIsSubmitting(false), 2000);
    };

    return (
        <FormPageLayout title="Create a New Order">
            <div className="space-y-8">
                <FormSection title="Customer Information">
                    <div className="space-y-6">
                        <FormRow cols={2}>
                            <FormField label="Customer Name">
                                <Input
                                    placeholder="Enter customer name"
                                    className="bg-gray-50 h-11 px-4"
                                />
                            </FormField>
                            <FormField label="Contact Number">
                                <Input
                                    placeholder="Enter contact number"
                                    className="bg-gray-50 h-11 px-4"
                                />
                            </FormField>
                        </FormRow>
                        <FormField label="Location">
                            <Input
                                placeholder="Enter customer's address"
                                className="bg-gray-50 h-11 px-4"
                            />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Booking Schedule">
                    <div className="space-y-6">
                        <FormField label="Obtainment Method">
                            <Select>
                                <SelectTrigger className="bg-gray-50 h-11 w-full sm:w-80">
                                    <SelectValue placeholder="Select Obtainment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="pickup">Pick-Up</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>
                        <FormRow cols={2}>
                            <FormField label="Date of Booking">
                                <Input
                                    type="date"
                                    className="bg-gray-50 h-11 px-4"
                                />
                            </FormField>
                            <FormField label="Date of Return">
                                <Input
                                    type="date"
                                    className="bg-gray-50 h-11 px-4"
                                />
                            </FormField>
                        </FormRow>
                    </div>
                </FormSection>

                <FormSection title="Delivery Option">
                    <div className="space-y-4">
                        <FormRow cols={2}>
                            <FormField label="Delivery Fee">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                                        ₱
                                    </span>
                                    <Input
                                        placeholder="0.00"
                                        className="bg-gray-50 h-11 pl-10 pr-4"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </FormField>
                            <FormField label="Deposit Fee">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500">
                                        ₱
                                    </span>
                                    <Input
                                        placeholder="0.00"
                                        className="bg-gray-50 h-11 pl-10 pr-4"
                                        type="number"
                                        min="0"
                                    />
                                </div>
                            </FormField>
                        </FormRow>
                    </div>
                </FormSection>

                <FormSection title="Order Status">
                    <FormField label="Select Status for this order item">
                        <Select>
                            <SelectTrigger className="bg-gray-50 h-11 w-full sm:w-80">
                                <SelectValue placeholder="Select Order Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="font-afacad">
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormField>
                </FormSection>

                <FormActions>
                    <Button
                        onClick={handleSubmit}
                        className="bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-8 h-11"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Finalize Order"
                        )}
                    </Button>
                </FormActions>
            </div>
        </FormPageLayout>
    );
};

export default ProductCard;
