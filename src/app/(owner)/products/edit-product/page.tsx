'use client'

import { Input } from '@/components/ui/input';
import { MoveLeft } from 'lucide-react'
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
import React from 'react'
import { Button } from '@/components/ui/button';

const page = () => {
    const router = useRouter();
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
                    <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Edit Product</h1>
                </div>

                <div>
                    <h1 className='font-afacad text-neutral-500'>Product Information</h1>
                    <hr />
                </div>

                <div className="pt-6 pb-10 space-y-6">
                    <div className="flex justify-between">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Name</h1>
                            <Input placeholder='Round Table' className='bg-neutral-100/50 min-w-80 h-12 px-5' />
                        </div>

                        <div>
                            <h1 className='text-sm text-neutral-500'>Category</h1>
                            <Select>
                                <SelectTrigger className="min-w-80 h-12 bg-neutral-100/50 px-5">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="apple">Rentals</SelectItem>
                                        <SelectItem value="banana">Services</SelectItem>
                                        <SelectItem value="blueberry">Events</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <h1 className='text-sm text-neutral-500'>Quantity</h1>
                        <Input placeholder={"Set the product's quantity"} className='bg-neutral-100/50 w-80 h-12 px-5' />
                    </div>
                </div>

                <div>
                    <h1 className='font-afacad text-neutral-500'>Pricing Information</h1>
                    <hr />
                </div>

                <div className="pt-6 pb-10 space-y-6">
                    <div>
                        <h1 className='text-sm text-neutral-500'>Pricing</h1>
                        <Input placeholder='PHP 5.00' className='bg-neutral-100/50 w-80 h-12 px-5' />
                    </div>
                </div>


                <div>
                    <h1 className='font-afacad text-neutral-500'>Extras</h1>
                    <hr />
                </div>

                <div className="pt-6 pb-10 space-y-6">
                    <div>
                        <h1 className='text-sm text-neutral-500'>Pax</h1>
                        <Input placeholder='PHP 750.00' className='bg-neutral-100/50 w-80 h-12 px-5' />
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

export default page