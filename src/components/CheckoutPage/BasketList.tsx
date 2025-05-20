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
    <div className="bg-white border border-[#D2D6DA] w-[750px] h-[350px] rounded-lg px-12 pt-6">
      <div className="font-afacad">
        <h1 className="text-2xl font-afacad_medium">
          <span>Basket List </span>
          <span>(2 item)</span>
        </h1>
        <h1 className="text-[#6B7280]">This is your current order</h1>
      </div>

      <ScrollArea className="h-60">
        <div>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
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
