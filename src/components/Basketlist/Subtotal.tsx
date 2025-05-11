import React from 'react'
import { Button } from '../ui/button'

const Subtotal = ({ amount }: SubtotalProps) => {
    return (
        <div className="absolute bottom-3 left-0 w-full bg-white p-4 font-afacad">
            <hr />
            <section className="mt-3 mb-10">
                <div className="flex justify-between items-center font-afacad_semibold">
                    <h1 className="text-2xl">Subtotal</h1>
                    <h1 className="text-xl">PHP {amount.toFixed(2)}</h1>
                </div>
                <h1 className="text-xs text-neutral-500 pr-20">Deposit and an optional delivery fee will be calculated at checkout</h1>
            </section>

            <section className="space-y-3">
                <a href="/checkout">
                    <Button className="bg-[#0F172A] w-full rounded-full">Checkout</Button>
                </a>
                <h1 className="text-center text-xs text-neutral-500">or {" "}
                    <a href="/shop">
                        <span className="underline hover:text-black cursor-pointer">Continue Shopping</span>
                    </a>
                </h1>
            </section>
        </div>
    )
}

export default Subtotal