"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types
export interface ProductImage {
  src: string;
}

export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: ProductImage;
  quantity: number;
}

interface OrderContextType {
  selectedProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string | number) => void;
  updateQuantity: (productId: string | number, newQuantity: number) => void;
  clearProducts: () => void;
}

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create a provider component
export function OrderProvider({ children }: { children: ReactNode }) {
  // Initialize with localStorage data if available (client-side only)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Initialize from localStorage when component mounts (client-side only)
  React.useEffect(() => {
    const savedProducts = localStorage.getItem("selectedProducts");
    if (savedProducts) {
      try {
        setSelectedProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse saved products:", e);
      }
    }
  }, []);

  // Save to localStorage whenever selectedProducts changes
  React.useEffect(() => {
    if (selectedProducts.length > 0) {
      localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    }
  }, [selectedProducts]);

  // Add product to selected products
  const addProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      // Check if product is already in the selected products
      const existingProductIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // If product already exists, increase its quantity
        const updatedProducts = [...prev];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          quantity: updatedProducts[existingProductIndex].quantity + 1
        };
        return updatedProducts;
      } else {
        // If product doesn't exist, add it with quantity 1
        return [...prev, {...product, quantity: product.quantity || 1}];
      }
    });
  };
  
  // Remove product from selected products
  const removeProduct = (productId: string | number) => {
    setSelectedProducts((prev) => {
      const newProducts = prev.filter(item => item.id !== productId);
      // If no products left, clear localStorage
      if (newProducts.length === 0) {
        localStorage.removeItem("selectedProducts");
      }
      return newProducts;
    });
  };
  
  // Update product quantity
  const updateQuantity = (productId: string | number, newQuantity: number) => {
    // Ensure quantity is at least 1
    const quantity = Math.max(1, newQuantity);
    
    setSelectedProducts((prev) => 
      prev.map(item => 
        item.id === productId ? {...item, quantity} : item
      )
    );
  };

  // Clear all products
  const clearProducts = () => {
    setSelectedProducts([]);
    localStorage.removeItem("selectedProducts");
  };

  return (
    <OrderContext.Provider value={{ 
      selectedProducts, 
      addProduct, 
      removeProduct, 
      updateQuantity,
      clearProducts
    }}>
      {children}
    </OrderContext.Provider>
  );
}

// Create a custom hook to use the context
export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}