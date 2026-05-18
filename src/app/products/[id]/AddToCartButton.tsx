"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    // Here we would dispatch to cart context or API
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
        isAdded 
          ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
          : "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(10,132,255,0.4)]"
      }`}
    >
      <ShoppingCart className="w-6 h-6" />
      {isAdded ? "Added to Cart!" : "Add to Cart"}
    </motion.button>
  );
}
