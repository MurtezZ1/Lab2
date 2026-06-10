import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

const STORAGE_KEY = "sunspot_compare_products";
const MAX_COMPARE_ITEMS = 3;

type CompareState = {
  items: Product[];
  notice: string;
};

const sameProduct = (left: Product, right: Product) =>
  String(left.uuid ?? left.id) === String(right.uuid ?? right.id) || String(left.id) === String(right.id);

const loadCompareItems = (): Product[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE_ITEMS) : [];
  } catch {
    return [];
  }
};

const saveCompareItems = (items: Product[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_COMPARE_ITEMS)));
};

const initialState: CompareState = {
  items: loadCompareItems(),
  notice: "",
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare(state, action: PayloadAction<Product>) {
      if (state.items.some((item) => sameProduct(item, action.payload))) {
        state.notice = "Product is already in compare.";
        return;
      }
      if (state.items.length >= MAX_COMPARE_ITEMS) {
        state.notice = "Maximum 3 products can be compared.";
        return;
      }
      state.items.push(action.payload);
      state.notice = `${action.payload.name} added to compare.`;
      saveCompareItems(state.items);
    },
    removeFromCompare(state, action: PayloadAction<number | string>) {
      state.items = state.items.filter(
        (item) => String(item.uuid ?? item.id) !== String(action.payload) && String(item.id) !== String(action.payload),
      );
      state.notice = "";
      saveCompareItems(state.items);
    },
    clearCompare(state) {
      state.items = [];
      state.notice = "";
      saveCompareItems(state.items);
    },
    clearCompareNotice(state) {
      state.notice = "";
    },
  },
});

export const { addToCompare, clearCompare, clearCompareNotice, removeFromCompare } = compareSlice.actions;
export default compareSlice.reducer;
