"use client";

import { addToCart } from "@/app/cart/actions";
import CartNotice from "@/components/CartNotice";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    setMessage("");

    startTransition(async () => {
      const result = await addToCart(productId);

      if (result.needsLogin) {
        window.location.href = "/account";
        return;
      }

      if (!result.ok) {
        setMessage(result.message ?? "Could not add this item.");
        return;
      }

      setIsAdded(true);
      setShowNotice(true);
      setTimeout(() => setIsAdded(false), 2000);
      setTimeout(() => setShowNotice(false), 2600);
    });
  };

  return (
    <div className="flex-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        disabled={isPending}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${
          isAdded
            ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            : "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(10,132,255,0.4)]"
        }`}
      >
        <ShoppingCart className="w-6 h-6" />
        {isPending ? "Adding..." : isAdded ? "Added to Cart!" : "Add to Cart"}
      </motion.button>
      {message && <p className="mt-2 text-sm text-red-300">{message}</p>}
      <CartNotice show={showNotice} />
    </div>
  );
}
