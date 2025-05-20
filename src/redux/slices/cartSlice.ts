import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store"; // adjust path if needed

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
  userId: string | null;
}

const getCartKey = (userId: string | null) => {
  return userId ? `cart_${userId}` : "cart_guest";
};

const loadCart = (userId: string | null): CartItem[] => {
  if (typeof window !== "undefined") {
    const key = getCartKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  }
  return [];
};

const saveCart = (items: CartItem[], userId: string | null) => {
  if (typeof window !== "undefined") {
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  }
};

// Initial userId from authSlice (if available)
let initialUserId: string | null = null;
if (typeof window !== "undefined") {
  try {
    const auth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    if (auth.auth) {
      const authState = JSON.parse(auth.auth);
      initialUserId = authState.user?.id ?? null;
    }
  } catch {}
}

const initialState: CartState = {
  items: loadCart(initialUserId),
  userId: initialUserId,
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
      saveCart(state.items, state.userId);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items, state.userId);
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items, state.userId);
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCart(state.items, state.userId);
    },
    // Call this when user logs in/out or switches
    updateUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
      if (!state.userId) {
        // No user logged in, clear the cart
        state.items = [];
        saveCart([], null);
      } else {
        // User logged in, load their cart
        state.items = loadCart(state.userId);
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart, updateUserId } =
  cartSlice.actions;
export default cartSlice.reducer;
