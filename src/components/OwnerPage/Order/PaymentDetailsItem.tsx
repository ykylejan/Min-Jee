import { icons } from '@/constants'
import { Download } from 'lucide-react'
import React from 'react'

const PaymentDetailsItem = () => {
    return (
        <div className="w-80 h-40 border border-neutral-200 rounded-lg font-afacad text-neutral-600 px-8 py-5 mt-5 cursor-pointer">
            <h1 className="font-afacad_semibold text-xl">GCash</h1>

            <div className="-space-y-2">
                <h1>Art Montebon</h1>
                <h1>Ref No: 1039SD9898OIN</h1>
            </div>

            <div className="flex justify-between mt-3">
                <div className="flex items-center gap-x-3">
                    <Download width={16} height={16} />
                    <h1 className='underline'>Receipt.png</h1>
                </div>

                <img src={icons.gcashActive.src} width={30} height={25} />
            </div>
        </div>
    )
}

export default PaymentDetailsItem