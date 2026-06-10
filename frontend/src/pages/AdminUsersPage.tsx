import { FormEvent, useEffect, useMemo, useState } from "react";
import type React from "react";
import { Eye, Search, ShieldCheck, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearAdminUsersMessage,
  deleteAdminUserThunk,
  fetchAdminUsers,
  updateAdminUserRoleThunk,
  updateAdminUserStatusThunk,
} from "@/redux/slices/adminUsersSlice";
import type { User } from "@/types";

type PendingAction =
  | { type: "role"; user: User; role: "Admin" | "Manager" | "Customer" }
  | { type: "status"; user: User; isActive: boolean }
  | { type: "delete"; user: User }
  | null;

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { items, total, page, pageSize, loading, error, success } = useAppSelector((state) => state.adminUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [pageSize, total]);

  useEffect(() => {
    void dispatch(fetchAdminUsers({ page: 1, pageSize, search, role, status }));
  }, [dispatch, pageSize, role, search, status]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(fetchAdminUsers({ page: 1, pageSize, search, role, status }));
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    if (pendingAction.type === "role") {
      await dispatch(updateAdminUserRoleThunk({ id: String(pendingAction.user.id), role: pendingAction.role }));
    }
    if (pendingAction.type === "status") {
      await dispatch(updateAdminUserStatusThunk({ id: String(pendingAction.user.id), isActive: pendingAction.isActive }));
    }
    if (pendingAction.type === "delete") {
      await dispatch(deleteAdminUserThunk(String(pendingAction.user.id)));
    }
    setPendingAction(null);
    setTimeout(() => dispatch(clearAdminUsersMessage()), 2500);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-white">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="mt-2 text-sm text-gray-400">View accounts, change roles, and control user access.</p>
        </div>
      </div>

      {(error || success) && (
        <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-400/20 bg-red-500/10 text-red-200" : "border-green-400/20 bg-green-500/10 text-green-200"}`}>
          {error || success}
        </div>
      )}

      <form onSubmit={submitSearch} className="glass-card mb-6 grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_180px_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email..." className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-white outline-none focus:border-primary" />
        </div>
        <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none">
          <option value="">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Customer">Customer</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none">
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/90">Search</button>
      </form>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Full Name</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created At</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map((user) => (
                <tr key={user.id} className="text-gray-200">
                  <td className="px-4 py-4 font-mono text-xs text-gray-500">{String(user.id).slice(0, 8)}</td>
                  <td className="px-4 py-4 font-bold text-white">{user.fullName ?? user.username}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4">
                    <select
                      value={user.role}
                      onChange={(event) => setPendingAction({ type: "role", user, role: event.target.value as "Admin" | "Manager" | "Customer" })}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Customer">Customer</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${Number(user.active) === 1 ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                      {Number(user.active) === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setSelectedUser(user)} className="rounded-lg border border-white/10 p-2 text-gray-300 hover:text-white" title="View details"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => setPendingAction({ type: "status", user, isActive: Number(user.active) !== 1 })} className="rounded-lg border border-white/10 p-2 text-gray-300 hover:text-white" title="Activate/deactivate">
                        {Number(user.active) === 1 ? <UserX className="h-4 w-4 text-red-300" /> : <UserCheck className="h-4 w-4 text-green-300" />}
                      </button>
                      <button onClick={() => setPendingAction({ type: "delete", user })} className="rounded-lg border border-white/10 p-2 text-red-300 hover:border-red-400/40" title="Delete safely"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-4 text-sm text-gray-400">
          <span>{loading ? "Loading..." : `${total} users`}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => dispatch(fetchAdminUsers({ page: page - 1, pageSize, search, role, status }))} className="rounded-lg border border-white/10 px-3 py-2 disabled:opacity-40">Prev</button>
            <span className="px-3 py-2">Page {page} / {pageCount}</span>
            <button disabled={page >= pageCount} onClick={() => dispatch(fetchAdminUsers({ page: page + 1, pageSize, search, role, status }))} className="rounded-lg border border-white/10 px-3 py-2 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <Modal title="User Details" onClose={() => setSelectedUser(null)}>
          <div className="space-y-2 text-sm text-gray-300">
            <p><b className="text-white">ID:</b> {selectedUser.id}</p>
            <p><b className="text-white">Name:</b> {selectedUser.fullName ?? selectedUser.username}</p>
            <p><b className="text-white">Email:</b> {selectedUser.email}</p>
            <p><b className="text-white">Role:</b> {selectedUser.role}</p>
            <p><b className="text-white">Status:</b> {selectedUser.status}</p>
          </div>
        </Modal>
      )}

      {pendingAction && (
        <Modal title="Confirm Admin Action" onClose={() => setPendingAction(null)}>
          <p className="text-sm text-gray-300">
            Confirm this change for <b className="text-white">{pendingAction.user.email}</b>?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setPendingAction(null)} className="rounded-xl border border-white/10 px-4 py-2 text-gray-200">Cancel</button>
            <button onClick={() => void confirmAction()} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="glass-card w-full max-w-lg rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
