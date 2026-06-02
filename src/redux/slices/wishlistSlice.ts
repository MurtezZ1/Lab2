import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

type WishlistState = {
  items: Product[];
};

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
  },
});

export const { setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;
