'use client'

import { Input } from '@/components/ui/input';
import { MoveLeft, MoveRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RiUploadCloudFill } from "react-icons/ri";
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { GiMailShirt } from 'react-icons/gi';

interface ProductCardProps {
    category?: string;
    action?: string;
}

const ProductCard = ({ category, action }: ProductCardProps) => {
    const router = useRouter();
    const [isVenue, setIsVenue] = useState(false);
    const [isKaraoke, setIsKaraoke] = useState(false);

    return (
        <div className="flex justify-center">
            <div className='bg-white min-h-screen w-[800px] rounded-lg border border-neutral-200 px-12 py-8'>

                <div className="flex gap-x-3 items-center mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    >
                        <MoveLeft width={20} height={20} className="text-neutral-600" />
                    </button>
                    <h1 className="font-afacad_medium text-3xl pl-3 ml-1">{action} {category ? category : "Product"}</h1>
                </div>

                <div>
                    <h1 className='font-afacad text-neutral-500'>Product Information</h1>
                    <hr />
                </div>

                <div className="pt-6 pb-10 space-y-6">
                    <div className="flex justify-between w-full">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Name</h1>
                            <Input placeholder='Enter the product name' className='bg-neutral-100/50 min-w-80 h-12 px-5' />
                        </div>

                        <div>
                            <h1 className='text-sm text-neutral-500'>Quantity</h1>
                            <Input placeholder={"Set the product's quantity"} className='bg-neutral-100/50 w-80 h-12 px-5' />
                        </div>
                    </div>


                </div>

                <div>
                    <h1 className='font-afacad text-neutral-500'>Pricing Information</h1>
                    <hr />
                </div>
                <div className="pt-6 pb-10 space-y-6">
                    <div className="flex justify-between w-full">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Pricing</h1>
                            <Input placeholder='Set the price' className='bg-neutral-100/50 w-80 h-12 px-5' />
                        </div>

                        {category === "Event" && (
                            <div className='w-80'>
                                <h1 className='text-sm text-neutral-500'>Pax</h1>
                                <Select>
                                    <SelectTrigger className="min-w-80 h-12 bg-neutral-100/50 px-5">
                                        <SelectValue placeholder="Select the pax amount" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="apple">50 pax</SelectItem>
                                            <SelectItem value="banana">75 pax</SelectItem>
                                            <SelectItem value="blueberry">100 pax</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                    </div>
                </div>


                <div>
                    <h1 className='font-afacad text-neutral-500'>Extras</h1>
                    <hr />
                </div>
                {category === "Event" && (
                    <div className="pt-6 space-y-6">
                        <div className='w-80'>
                            <h1 className='text-sm text-neutral-500 mb-3'>Add ons</h1>

                            <div className="space-y-3 pl-10">
                                <div className="flex items-center justify-between gap-x-8">
                                    <div
                                        onClick={() => setIsVenue(!isVenue)}
                                        className={`min-w-60 h-14 rounded-md border border-neutral-300 flex justify-center items-center gap-x-5 cursor-pointer ${isVenue ? "bg-camouflage-200" : ""}`}
                                    >
                                        <div className={`rounded-full w-4 h-4 border-2 ${isVenue ? "bg-camouflage-400 border-camouflage-400" : "border-neutral-400"}`} />
                                        <h1 className={`font-afacad ${isVenue ? "text-camouflage-800" : ""}`}>Venue</h1>
                                    </div>
                                    {isVenue && (
                                        <div className='flex items-center gap-x-8'>
                                            <MoveRight size={30} className='text-camouflage-600' />
                                            <div className="">
                                                <h1 className='text-xs text-neutral-500'>Pricing</h1>
                                                <Input placeholder='Set Price' className='bg-neutral-100/50 w-60 h-10 px-5' />
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="flex items-center justify-between gap-x-8">
                                    <div
                                        onClick={() => setIsKaraoke(!isKaraoke)}
                                        className={`min-w-60 h-14 rounded-md border border-neutral-300 flex justify-center items-center gap-x-5 cursor-pointer ${isKaraoke ? "bg-camouflage-200" : ""}`}
                                    >
                                        <div className={`rounded-full w-4 h-4 border-2 ${isKaraoke ? "bg-camouflage-400 border-camouflage-400" : "border-neutral-400"}`} />
                                        <h1 className={`font-afacad ${isKaraoke ? "text-camouflage-800" : ""}`}>Karaoke</h1>
                                    </div>
                                    {isKaraoke && (
                                        <div className='flex items-center gap-x-8'>
                                            <MoveRight size={30} className='text-camouflage-600' />
                                            <div className="">
                                                <h1 className='text-xs text-neutral-500'>Pricing</h1>
                                                <Input placeholder='Set Price' className='bg-neutral-100/50 w-60 h-10 px-5' />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>




                        </div>
                    </div>
                )}

                <div className="pt-6 pb-10 space-y-6">
                    <div>
                        <h1 className='text-sm text-neutral-500'>Description</h1>
                        <Textarea placeholder={"Write the product's description here.."} className='bg-neutral-100/50 w-full h-28 px-5 py-3' />
                    </div>
                </div>


                <div>
                    <h1 className='font-afacad text-neutral-500'>Media</h1>
                    <hr />
                </div>
                <div className="pt-6 px-24">
                    <div className="border-2 border-dashed border-camouflage-300 rounded-lg w-full h-48 cursor-pointer flex flex-col justify-center items-center font-afacad hover:opacity-80">
                        <RiUploadCloudFill size={64} className='text-camouflage-400' />
                        <h1 className='text-sm'>Drop your image here or <span className='text-camouflage-400'>Browse</span></h1>
                        <h1 className='text-neutral-500 text-sm pt-2'>Support: JPEG, JPG, PNG</h1>
                    </div>
                </div>

                <div className="pt-16 pb-10 flex justify-end">
                    <Button className='bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6'>Add Product</Button>
                </div>


            </div>
        </div>
    )
}

export default ProductCard