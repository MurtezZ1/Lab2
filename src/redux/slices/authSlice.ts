import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { getCurrentUser } from "@/services/authService";

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: typeof window === "undefined" ? null : getCurrentUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
