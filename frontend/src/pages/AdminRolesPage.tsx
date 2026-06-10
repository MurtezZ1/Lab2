import { ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAdminPermissions } from "@/redux/slices/permissionsSlice";
import { addRolePermissionThunk, fetchAdminRoles, removeRolePermissionThunk } from "@/redux/slices/rolesSlice";

export default function AdminRolesPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.roles.items);
  const permissions = useAppSelector((state) => state.permissions.items);
  const loading = useAppSelector((state) => state.roles.loading || state.permissions.loading);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string>>({});

  useEffect(() => {
    void dispatch(fetchAdminRoles());
    void dispatch(fetchAdminPermissions());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-black text-white">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Roles & Permissions
        </h1>
        <p className="mt-2 text-sm text-gray-400">Assign or remove permissions from each role.</p>
      </div>

      <div className="grid gap-5">
        {roles.map((role) => {
          const assigned = new Set(role.permissions.map((permission) => permission.id));
          const available = permissions.filter((permission) => !assigned.has(permission.id));
          return (
            <section key={role.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{role.name}</h2>
                  <p className="text-sm text-gray-400">{role.description || `${role.name} role`} • {role.usersCount} users</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedPermissions[role.id] ?? ""}
                    onChange={(event) => setSelectedPermissions((items) => ({ ...items, [role.id]: event.target.value }))}
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                  >
                    <option value="">Select permission</option>
                    {available.map((permission) => (
                      <option key={permission.id} value={permission.id}>{permission.name}</option>
                    ))}
                  </select>
                  <button
                    disabled={!selectedPermissions[role.id]}
                    onClick={() => {
                      const permissionId = selectedPermissions[role.id];
                      if (!permissionId) return;
                      void dispatch(addRolePermissionThunk({ roleId: role.id, permissionId }));
                      setSelectedPermissions((items) => ({ ...items, [role.id]: "" }));
                    }}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                  >
                    Assign
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span key={permission.id} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-200">
                    {permission.name}
                    <button
                      onClick={() => void dispatch(removeRolePermissionThunk({ roleId: role.id, permissionId: permission.id }))}
                      className="text-gray-500 hover:text-red-300"
                      title="Remove permission"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {!role.permissions.length && <p className="text-sm text-gray-500">No permissions assigned.</p>}
              </div>
            </section>
          );
        })}
        {loading && <div className="glass-card rounded-2xl p-6 text-gray-400">Loading roles...</div>}
      </div>
    </div>
  );
}
