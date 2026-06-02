import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

type UsersState = {
  items: User[];
};

const initialState: UsersState = { items: [] };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.items = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
