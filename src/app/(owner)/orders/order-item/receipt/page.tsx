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

                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                    <MoveLeft width={20} height={20} />
                </button>

                <Receipt data={data} />
            </div>
        </div>
    )
}

export default page