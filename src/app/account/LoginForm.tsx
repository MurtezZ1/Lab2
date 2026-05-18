"use client";

import { useActionState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="glass-card rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Sign In</h2>
        <p className="text-sm text-gray-400 mt-1">Use your SunSpot account details.</p>
      </div>

      {state.message && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      <label className="block">
        <span className="text-sm text-gray-300">Email</span>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <input
            name="email"
            type="email"
            required
            className="w-full bg-transparent py-3 text-white outline-none"
            placeholder="you@example.com"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-sm text-gray-300">Password</span>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4">
          <Lock className="w-5 h-5 text-gray-500" />
          <input
            name="password"
            type="password"
            required
            className="w-full bg-transparent py-3 text-white outline-none"
            placeholder="Password"
          />
        </div>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <User className="w-5 h-5" />
        {pending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
