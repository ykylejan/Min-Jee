import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import ProductItemCheckout from "./ProductItemCheckout";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";

const BasketList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div className="bg-white border border-[#545557] w-full rounded-lg px-3 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
      <div className="font-afacad mb-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-afacad_medium">
          <span>Basket List </span>
          {cartItems.length > 0 && (
            <span className="text-[#6B7280] text-sm sm:text-base font-normal">
              ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>
        <h1 className="text-[#6B7280] text-sm sm:text-base">This is your current order</h1>
      </div>

      <ScrollArea className={`${cartItems.length > 2 ? 'max-h-[280px] sm:max-h-[320px]' : ''}`}>
        <div className="space-y-2">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 py-4">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <ProductItemCheckout
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                image={item.image}
                onIncrease={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                onDecrease={() => {
                  if (item.quantity > 1) {
                    dispatch(addToCart({ ...item, quantity: -1 }));
                  }
                }}
                onRemove={() => dispatch(removeFromCart(item.id))}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BasketList;
