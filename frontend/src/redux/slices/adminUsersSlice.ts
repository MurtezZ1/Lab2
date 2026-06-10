import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  changeAdminUserRole,
  changeAdminUserStatus,
  deleteAdminUser,
  getAdminUsers,
  type AdminUsersQuery,
} from "@/services/adminService";
import type { User } from "@/types";

type AdminUsersState = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: string;
  success: string;
};

const initialState: AdminUsersState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: "",
  success: "",
};

export const fetchAdminUsers = createAsyncThunk("adminUsers/fetch", getAdminUsers);

export const updateAdminUserRoleThunk = createAsyncThunk(
  "adminUsers/updateRole",
  ({ id, role }: { id: string; role: "Admin" | "Manager" | "Customer" }) => changeAdminUserRole(id, role),
);

export const updateAdminUserStatusThunk = createAsyncThunk(
  "adminUsers/updateStatus",
  ({ id, isActive }: { id: string; isActive: boolean }) => changeAdminUserStatus(id, isActive),
);

export const deleteAdminUserThunk = createAsyncThunk("adminUsers/delete", deleteAdminUser);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUsersMessage(state) {
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state, action) => {
        state.loading = true;
        state.error = "";
        const query = action.meta.arg as AdminUsersQuery;
        state.page = Number(query.page ?? state.page);
        state.pageSize = Number(query.pageSize ?? state.pageSize);
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Users could not be loaded.";
      })
      .addMatcher(
        isAnyOf(updateAdminUserRoleThunk.fulfilled, updateAdminUserStatusThunk.fulfilled, deleteAdminUserThunk.fulfilled),
        (state, action) => {
          const user = action.payload as User;
          state.items = state.items.map((item) => (item.id === user.id ? user : item));
          state.success = "User updated successfully.";
          state.error = "";
        },
      )
      .addMatcher(
        isAnyOf(updateAdminUserRoleThunk.rejected, updateAdminUserStatusThunk.rejected, deleteAdminUserThunk.rejected),
        (state, action) => {
          state.error = action.error.message ?? "User update failed.";
        },
      );
  },
});

export const { clearAdminUsersMessage } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
