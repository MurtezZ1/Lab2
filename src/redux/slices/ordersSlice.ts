import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "@/types";

type OrdersState = {
  items: Order[];
};

const initialState: OrdersState = { items: [] };

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
