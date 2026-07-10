import { CheckCircle2, X, XCircle } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: string; message: string; type: ToastType };
type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-[120] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const isError = toast.type === "error";
          const Icon = isError ? XCircle : CheckCircle2;
          return (
            <div
              key={toast.id}
              className={`rounded-2xl border p-4 shadow-2xl backdrop-blur ${
                isError ? "border-red-400/30 bg-red-950/90 text-red-100" : "border-green-400/30 bg-zinc-950/95 text-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isError ? "text-red-300" : "text-green-300"}`} />
                <p className="min-w-0 flex-1 text-sm font-semibold leading-relaxed">{toast.message}</p>
                <button onClick={() => removeToast(toast.id)} className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Dismiss notification">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider.");
  return context;
}
