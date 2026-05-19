"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShoppingCart } from "lucide-react";

type CartNoticeProps = {
  show: boolean;
  message?: string;
};

export default function CartNotice({
  show,
  message = "Produkti u shtua ne shporte.",
}: CartNoticeProps) {
  if (!show) return null;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.96 }}
      className="fixed bottom-6 right-6 z-[100] w-[min(22rem,calc(100vw-3rem))] rounded-xl border border-green-400/30 bg-zinc-950/95 p-4 text-white shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-green-500/15 p-2 text-green-300">
          <CheckCircle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">U shtua ne shporte</p>
          <p className="mt-1 text-sm text-gray-300">{message}</p>
        </div>
        <ShoppingCart className="mt-1 h-5 w-5 shrink-0 text-primary" />
      </div>
    </motion.div>
  );
}
