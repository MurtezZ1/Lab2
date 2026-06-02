import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type BrandsState = {
  items: string[];
};

const initialState: BrandsState = { items: [] };

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrands(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
    },
  },
});

export const { setBrands } = brandsSlice.actions;
export default brandsSlice.reducer;
