import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  addRolePermission,
  getAdminRoles,
  removeRolePermission,
  type AdminRole,
} from "@/services/adminService";

type RolesState = {
  items: AdminRole[];
  loading: boolean;
  error: string;
  success: string;
};

const initialState: RolesState = { items: [], loading: false, error: "", success: "" };

export const fetchAdminRoles = createAsyncThunk("roles/fetchAdminRoles", getAdminRoles);
export const addRolePermissionThunk = createAsyncThunk(
  "roles/addPermission",
  ({ roleId, permissionId }: { roleId: string; permissionId: string }) => addRolePermission(roleId, permissionId),
);
export const removeRolePermissionThunk = createAsyncThunk(
  "roles/removePermission",
  ({ roleId, permissionId }: { roleId: string; permissionId: string }) => removeRolePermission(roleId, permissionId),
);

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRoles.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAdminRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.roles;
      })
      .addCase(fetchAdminRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Roles could not be loaded.";
      })
      .addMatcher(
        isAnyOf(addRolePermissionThunk.fulfilled, removeRolePermissionThunk.fulfilled),
        (state, action) => {
          state.items = action.payload.roles;
          state.success = "Permissions updated.";
        },
      );
  },
});

export default rolesSlice.reducer;
