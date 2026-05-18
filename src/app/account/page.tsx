import { LogOut, ShieldCheck, User } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { logout } from "./actions";
import { getCurrentUser } from "@/lib/users";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-[1fr_520px] gap-10 items-start">
        <section>
          <h1 className="text-3xl font-bold text-white mb-3">Account</h1>
          <p className="text-gray-400 max-w-2xl">
            Sign in to manage orders, saved devices, and checkout details.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              ["Fast checkout", "Keep shipping details ready."],
              ["Order history", "Track recent purchases."],
              ["Saved picks", "Return to products you liked."],
            ].map(([title, body]) => (
              <div key={title} className="glass-card rounded-2xl p-5">
                <h2 className="text-white font-bold">{title}</h2>
                <p className="text-sm text-gray-400 mt-2">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {user ? (
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.username}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-semibold text-white">Signed in</p>
                <p className="text-xs text-gray-400">Role: {user.role}</p>
              </div>
            </div>

            <form action={logout}>
              <button className="w-full border border-white/10 text-gray-200 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <RegisterForm />
            <LoginForm />
          </div>
        )}
      </div>
    </div>
  );
}
