import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  // Add more fields as needed
}

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored);
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
