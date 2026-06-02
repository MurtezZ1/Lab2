import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

type ProductsState = {
  items: Product[];
  page: number;
  pageSize: number;
  search: string;
  brand: string;
  category: string;
  sortBy: "name" | "price-low" | "price-high" | "brand";
};

const initialState: ProductsState = {
  items: [],
  page: 1,
  pageSize: 6,
  search: "",
  brand: "all",
  category: "all",
  sortBy: "name",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    setProductFilters(state, action: PayloadAction<Partial<Omit<ProductsState, "items">>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setProducts, setProductFilters } = productsSlice.actions;
export default productsSlice.reducer;
