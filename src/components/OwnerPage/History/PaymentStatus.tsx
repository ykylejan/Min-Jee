import React from 'react'

interface PaymentStatusProps {
    status: string;
}

const PaymentStatus = ({status}: PaymentStatusProps) => {
  return (
    <div className='font-interbold'>
        {status === "Completed" ? (
            <div className="">
                <h1 className='text-green-700'>Completed</h1>
            </div>
        ) : status === "Pending" ? (
            <div className="">
                <h1 className='text-orange-600'>Pending</h1>
            </div>
        ) : (
            <div className="">

            </div>
        )}
    </div>
  )
}

export default PaymentStatus