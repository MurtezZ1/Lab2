import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CategoriesState = {
  items: string[];
};

const initialState: CategoriesState = { items: [] };

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
    },
  },
});

export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
