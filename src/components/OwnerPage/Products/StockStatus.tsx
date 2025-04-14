import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'


interface StockStatusProps {
    status: string;
}

const StockStatus = ({ status }: StockStatusProps) => {
    return (
        <>

            {status === "In Stock" ?
                (
                    <div className='flex items-center gap-x-2 text-green-500'>
                        <TrendingUp size={20} />
                        <h1>{status} </h1>
                    </div>
                ) : status === "Out of Stock" ? (
                    <div className='flex items-center gap-x-2 text-orange-500'>
                        <TrendingDown size={20} />
                        <h1>{status} </h1>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2 text-yellow-500">
                        <h1>{status} </h1>
                    </div>
                )
            }

        </>
    )
}

export default StockStatus