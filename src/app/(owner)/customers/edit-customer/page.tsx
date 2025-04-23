'use client'

import { Input } from '@/components/ui/input';
import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '@/components/ui/button';

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
                        <h1 className="font-afacad_medium text-3xl pl-3 ml-1">Edit Customer</h1>
                        
                        <div className="flex items-center gap-x-3">
                            <div className="rounded-full bg-[#A6E7D8] border border-[#008767] w-2 h-2" />
                            <h1 className='font-afacad pr-5'>Active</h1>
                        </div>

                    </div>
                </div>

                <div>
                    <h1 className='font-afacad text-neutral-500'>Customer Information</h1>
                    <hr />
                </div>

                <div className="pt-6 pb-10 space-y-6">
                    <div className="flex justify-between">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Name</h1>
                            <Input placeholder='John Doe' className='bg-neutral-100/50 min-w-80 h-12 px-5' defaultValue={"Art"} />
                        </div>

                        <div>
                            <h1 className='text-sm text-neutral-500'>Contact Number</h1>
                            <Input placeholder='09123456789' className='bg-neutral-100/50 min-w-80 h-12 px-5' defaultValue={"0998765431"}/>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <h1 className='text-sm text-neutral-500'>Email</h1>
                            <Input placeholder='johndoe@gmail.com' className='bg-neutral-100/50 min-w-80 h-12 px-5' defaultValue={"arkiart@gmail.com"}/>
                        </div>

                        <div>
                            <h1 className='text-sm text-neutral-500'>Address</h1>
                            <Input placeholder='Bangkal, Davao City' className='bg-neutral-100/50 min-w-80 h-12 px-5' defaultValue={"03 Red Stone Calinan"} />
                        </div>
                    </div>

                </div>


                <div className="pt-16 flex justify-end">
                    <Button className='bg-camouflage-400 hover:bg-camouflage-400/80 text-white text-base font-afacad px-6'>Update</Button>
                </div>


            </div>
        </div>
    )
}

export default page