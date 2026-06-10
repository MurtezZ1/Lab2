import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAdminRoles, type AdminPermission } from "@/services/adminService";

type PermissionsState = {
  items: AdminPermission[];
  loading: boolean;
  error: string;
};

const initialState: PermissionsState = { items: [], loading: false, error: "" };

export const fetchAdminPermissions = createAsyncThunk("permissions/fetchAdminPermissions", getAdminRoles);

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminPermissions.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAdminPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.permissions;
      })
      .addCase(fetchAdminPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Permissions could not be loaded.";
      });
  },
});

export default permissionsSlice.reducer;
