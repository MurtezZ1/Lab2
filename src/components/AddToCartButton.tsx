import CartNotice from "@/components/CartNotice";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cartSlice";
import { addProductToCart } from "@/services/cartService";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const [isPending, startTransition] = useTransition();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAdd = () => {
    setMessage("");

    startTransition(async () => {
      if (!user) {
        navigate("/account");
        return;
      }

      dispatch(setCartItems(await addProductToCart(user, product)));
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
