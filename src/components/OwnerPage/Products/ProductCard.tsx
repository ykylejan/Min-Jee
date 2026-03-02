'use client'

import { Input } from '@/components/ui/input';
import { Loader2, MoveRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RiUploadCloudFill } from "react-icons/ri";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
    const [isVenue, setIsVenue] = useState(false);
    const [isKaraoke, setIsKaraoke] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/products');
        }, 1000);
    };

    return (
        <FormPageLayout title={`${action} ${category ? category : "Product"}`}>
            <div className="space-y-6">
                <FormSection title="Product Information">
                    <FormRow>
                        <FormField label="Name">
                            <Input 
                                placeholder='Enter the product name' 
                                className='bg-gray-50 h-11 px-4' 
                            />
                        </FormField>
                        <FormField label="Quantity">
                            <Input 
                                placeholder="Set the product's quantity" 
                                className='bg-gray-50 h-11 px-4' 
                            />
                        </FormField>
                    </FormRow>
                </FormSection>

                <FormSection title="Pricing Information">
                    <FormRow>
                        <FormField label="Pricing (₱)">
                            <Input 
                                placeholder='Set the price' 
                                className='bg-gray-50 h-11 px-4' 
                                type="number"
                            />
                        </FormField>

                        {category === "Event" && (
                            <FormField label="Pax">
                                <Select>
                                    <SelectTrigger className="bg-gray-50 h-11">
                                        <SelectValue placeholder="Select the pax amount" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="50">50 pax</SelectItem>
                                            <SelectItem value="75">75 pax</SelectItem>
                                            <SelectItem value="100">100 pax</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormField>
                        )}
                    </FormRow>
                </FormSection>

                {category === "Event" && (
                    <FormSection title="Add-ons">
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsVenue(!isVenue)}
                                    className={`w-full sm:w-48 h-14 rounded-lg border-2 flex justify-center items-center gap-3 cursor-pointer transition-all ${
                                        isVenue 
                                            ? "bg-camouflage-100 border-camouflage-400" 
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className={`rounded-full w-4 h-4 border-2 transition-all ${
                                        isVenue 
                                            ? "bg-camouflage-400 border-camouflage-400" 
                                            : "border-gray-300"
                                    }`} />
                                    <span className={`font-medium ${isVenue ? "text-camouflage-700" : "text-gray-600"}`}>
                                        Venue
                                    </span>
                                </button>
                                {isVenue && (
                                    <div className='flex items-center gap-4'>
                                        <MoveRight className='text-camouflage-500 hidden sm:block' />
                                        <FormField label="Venue Price">
                                            <Input 
                                                placeholder='Set Price' 
                                                className='bg-gray-50 h-11 px-4 w-full sm:w-40' 
                                                type="number"
                                            />
                                        </FormField>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsKaraoke(!isKaraoke)}
                                    className={`w-full sm:w-48 h-14 rounded-lg border-2 flex justify-center items-center gap-3 cursor-pointer transition-all ${
                                        isKaraoke 
                                            ? "bg-camouflage-100 border-camouflage-400" 
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className={`rounded-full w-4 h-4 border-2 transition-all ${
                                        isKaraoke 
                                            ? "bg-camouflage-400 border-camouflage-400" 
                                            : "border-gray-300"
                                    }`} />
                                    <span className={`font-medium ${isKaraoke ? "text-camouflage-700" : "text-gray-600"}`}>
                                        Karaoke
                                    </span>
                                </button>
                                {isKaraoke && (
                                    <div className='flex items-center gap-4'>
                                        <MoveRight className='text-camouflage-500 hidden sm:block' />
                                        <FormField label="Karaoke Price">
                                            <Input 
                                                placeholder='Set Price' 
                                                className='bg-gray-50 h-11 px-4 w-full sm:w-40' 
                                                type="number"
                                            />
                                        </FormField>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>
                )}

                <FormSection title="Description">
                    <FormField label="Description (Optional)">
                        <Textarea 
                            placeholder="Write the product's description here..." 
                            className='bg-gray-50 min-h-24 px-4 py-3' 
                        />
                    </FormField>
                </FormSection>

                <FormSection title="Media">
                    <div className="border-2 border-dashed border-camouflage-300 rounded-lg w-full h-48 cursor-pointer flex flex-col justify-center items-center hover:bg-camouflage-50/50 transition-colors">
                        <RiUploadCloudFill size={48} className='text-camouflage-400 mb-2' />
                        <p className='text-sm text-gray-600'>
                            Drop your image here or <span className='text-camouflage-500 font-medium'>Browse</span>
                        </p>
                        <p className='text-gray-400 text-xs mt-1'>Support: JPEG, JPG, PNG</p>
                    </div>
                </FormSection>

                <FormActions>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        className='bg-camouflage-400 hover:bg-camouflage-500 text-white w-full sm:w-auto'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add Product"
                        )}
                    </Button>
                </FormActions>
            </div>
        </FormPageLayout>
    )
}

export default ProductCard