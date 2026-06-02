import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ReportsState = {
  revenue: number;
  orders: number;
  customers: number;
  inventoryAlerts: number;
};

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    revenue: 0,
    orders: 0,
    customers: 0,
    inventoryAlerts: 0,
  } satisfies ReportsState,
  reducers: {
    setReports(state, action: PayloadAction<Partial<ReportsState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setReports } = reportsSlice.actions;
export default reportsSlice.reducer;
