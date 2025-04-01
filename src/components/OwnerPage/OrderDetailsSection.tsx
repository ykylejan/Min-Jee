import React from 'react'

const OrderDetailsSection = () => {
    return (
        <div className="flex flex-row gap-x-10 mt-5 font-afacad text-neutral-600">
            <div className="space-y-3">
                <h1 className="flex justify-between gap-x-7">
                    <span>Order Number:</span>
                    <span>REF 10225</span>
                </h1>
                <h1 className="flex justify-between gap-x-7">
                    <span>Customer Name:</span>
                    <span>Art Montebon</span>
                </h1>
                <h1 className="flex justify-between gap-x-7">
                    <span>Contact Number:</span>
                    <span>09987654321</span>
                </h1>
            </div>

            <div className="border border-r-0"></div>

            <div className="space-y-3">
                <h1 className="flex justify-between gap-x-7">
                    <span>Obtainment:</span>
                    <span>Shipped</span>
                </h1>
                <h1 className="flex justify-between gap-x-7">
                    <span>Location:</span>
                    <span>03 Red Stone, Calinan</span>
                </h1>
                <h1 className="flex justify-between gap-x-7">
                    <span>Date of Booking:</span>
                    <span>December 26, 2024</span>
                </h1>
            </div>
        </div>
    )
}

export default OrderDetailsSection