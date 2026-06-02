import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/types";

type NotificationsState = {
  items: Notification[];
};

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
