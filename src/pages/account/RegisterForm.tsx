import { FormEvent, useState } from "react";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/authSlice";
import { registerUser } from "@/services/authService";

export default function RegisterForm() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const user = await registerUser({
        username: String(formData.get("username") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
      });
      dispatch(setUser(user));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create account.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Create Account</h2>
        <p className="text-sm text-gray-400 mt-1">Register a new SunSpot account.</p>
      </div>

      {message && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {message}
        </p>
      )}

      <label className="block">
        <span className="text-sm text-gray-300">Username</span>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4">
          <User className="w-5 h-5 text-gray-500" />
          <input name="username" required className="w-full bg-transparent py-3 text-white outline-none" placeholder="username" />
        </div>
      </label>

      <label className="block">
        <span className="text-sm text-gray-300">Email</span>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <input name="email" type="email" required className="w-full bg-transparent py-3 text-white outline-none" placeholder="you@example.com" />
        </div>
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-gray-300">Password</span>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4">
            <Lock className="w-5 h-5 text-gray-500" />
            <input name="password" type="password" required minLength={8} className="w-full bg-transparent py-3 text-white outline-none" placeholder="Password" />
          </div>
        </label>

        <label className="block">
          <span className="text-sm text-gray-300">Confirm</span>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-black/40 border border-white/10 px-4">
            <Lock className="w-5 h-5 text-gray-500" />
            <input name="confirmPassword" type="password" required minLength={8} className="w-full bg-transparent py-3 text-white outline-none" placeholder="Confirm" />
          </div>
        </label>
      </div>

      <button type="submit" disabled={pending} className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
        <UserPlus className="w-5 h-5" />
        {pending ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
