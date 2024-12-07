'use'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  name: string;
  price: number | null;
  quantity: number;
  offer: number | null;
  image: string;
  description: string;
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  variant: { name: string; price: number; isAvailable: boolean };
  isVeg: boolean;
}

interface CartState {
  items: any[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.variant === action.payload.variant
      );

      if (existingItem) {
        // If item already exists, increase its quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        // Add new item to the cart
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ _id: string; variant: { name: string; } }>) => {
      state.items = state.items.filter(
        (item) =>
          item._id !== action.payload._id ||
          item.variant !== action.payload.variant
      );
    },
    incrementQuantity: (state, action: PayloadAction<{ _id: string; variant: { name: string; } }>) => {
      const item = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.variant === action.payload.variant
      );
    
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<{ _id: string; variant: { name: string; } }>) => {
      const item = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.variant === action.payload.variant
      );
    
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove item if quantity drops to 0 or below
          state.items = state.items.filter(
            (i) =>
              i._id !== item._id ||
              i.variant !== item.variant
          );
        }
      }
    },
    clearCart: (state) => {
      state.items = []; // Clear all items from the cart
    },
}});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity,clearCart } = cartSlice.actions;
export default cartSlice.reducer;
