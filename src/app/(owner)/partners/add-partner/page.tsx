'use client'

import { Input } from '@/components/ui/input';
import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const page = () => {
    const router = useRouter();
    return (
        <div className="flex justify-center">
            <div className='bg-white w-[800px] rounded-lg border border-neutral-200 px-12 py-8'>

                <div className="flex gap-x-3 items-center mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    >
                        <MoveLeft width={20} height={20} className="text-neutral-600" />
                    </button>
                    <div className="flex justify-between items-center w-full">
                        <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Add Partner</h1>

                    </div>
                </div>

                <div>
                    <h1 className='font-afacad text-neutral-500'>Partner Information</h1>
                    <hr />
                </div>

                <div className="pt-6 pb-10 space-y-6">
                    <div className="flex justify-between">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Name</h1>
                            <Input placeholder='John Doe' className='bg-neutral-100/50 min-w-80 h-12 px-5' />
                        </div>

                        <div>
                            <h1 className='text-sm text-neutral-500'>Contact Number</h1>
                            <Input placeholder='09123456789' className='bg-neutral-100/50 min-w-80 h-12 px-5' />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Address</h1>
                            <Input placeholder='Bangkal, Davao City' className='bg-neutral-100/50 min-w-80 h-12 px-5' />
                        </div>

                        <div className="">
                            <h1 className='text-sm text-neutral-500'>Category</h1>
                            <Select>
                                <SelectTrigger className="min-w-80 h-12 bg-neutral-100/50 px-5">
                                    <SelectValue placeholder="Select their category type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="apple">Food Catering</SelectItem>
                                        <SelectItem value="banana">Entertainment</SelectItem>
                                        <SelectItem value="blueberry">Music</SelectItem>
                                        <SelectItem value="blueberry">Technicals</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </div>


                <div className="pt-16 flex justify-end">
                    <Button
                        className='bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6'
                        onClick={() => {
                            toast("Partner Added Successfully", {
                                description:
                                    "New partner is added to the repository",
                                className: "bg-green-500/80 border border-none text-white",
                            });
                            router.push('/partners');
                        }}
                    >
                        Add
                    </Button>
                </div>


            </div>
        </div>
    )
}

export default page