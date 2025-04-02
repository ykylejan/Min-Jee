'use client'

import Receipt from '@/components/ReceiptCard/Receipt'
import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const data = {
        customerName: "Kyle Dellatan",
        subtotal: 5000,
        deliveryfee: 100,
    }

    const router = useRouter();

    return (
        <div className='flex justify-center'>
            <div className='space-y-3'>

                <div onClick={() => router.back()}>
                    <MoveLeft
                        width={25} height={25}
                        className='hover:cursor-pointer'
                    />
                </div>

                <Receipt data={data} />
            </div>
        </div>
    )
}

export default page