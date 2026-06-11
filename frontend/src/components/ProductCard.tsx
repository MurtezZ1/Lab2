import CartNotice from "@/components/CartNotice";
import ProductFeedback from "@/components/ProductFeedback";
import { motion } from "framer-motion";
import { GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { setWishlistItems } from "@/redux/slices/wishlistSlice";
import { addProductToCart } from "@/services/cartService";
import { toggleWishlist } from "@/services/wishlistService";
import type { Product } from "@/types";

interface ProductProps {
  id: number | string;
  uuid?: string;
  name: string;
  price: number;
  image: string;
  manufacturer: string;
}

export default function ProductCard({ id, uuid, name, price, image, manufacturer }: ProductProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [compareNotice, setCompareNotice] = useState("");
  const [isPending, startTransition] = useTransition();
  const user = useAppSelector((state) => state.auth.user);
  const compareItems = useAppSelector((state) => state.compare.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const product: Product = {
    id,
    uuid,
    name,
    price,
    image,
    manufacturer,
    model: "",
    type: "laptop",
    year: null,
    processor: null,
    ram_size: null,
    storage: null,
    display: null,
    os: null,
    battery: null,
    weight: null,
    dimensions: null,
    keyboard: null,
    ports: null,
    connectivity: null,
    camera: null,
    additional_features: null,
    description: null,
    discount_percentage: 0,
    stock_quantity: 0,
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      if (!user) {
        navigate("/account");
        return;
      }

      dispatch(setCartItems(await addProductToCart(user, product)));
      setIsAdded(true);
      setShowNotice(true);
      setTimeout(() => setIsAdded(false), 1500);
      setTimeout(() => setShowNotice(false), 2600);
    });
  };

  const handleCompare = () => {
    const alreadyAdded = compareItems.some(
      (item) => String(item.uuid ?? item.id) === String(product.uuid ?? product.id) || String(item.id) === String(product.id),
    );
    if (alreadyAdded) setCompareNotice("Product is already in compare.");
    else if (compareItems.length >= 3) setCompareNotice("Maximum 3 products can be compared.");
    else setCompareNotice(`${name} added to compare.`);
    dispatch(addToCompare(product));
    setTimeout(() => setCompareNotice(""), 2500);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card rounded-2xl p-4 flex flex-col gap-4 group relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-4 group-hover:translate-x-0 duration-300">
        <button
          type="button"
          onClick={async () => {
            if (!user) {
              navigate("/account");
              return;
            }
            dispatch(setWishlistItems(await toggleWishlist(user, product)));
          }}
          className="bg-white/10 hover:bg-primary text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCompare}
          className="bg-white/10 hover:bg-accent text-white p-2 rounded-full backdrop-blur-md transition-colors"
          aria-label={`Compare ${name}`}
        >
          <GitCompareArrows className="w-4 h-4" />
        </button>
      </div>

      <Link to={`/products/${id}`} className="block relative w-full h-48 rounded-xl overflow-hidden bg-white/5">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{manufacturer}</span>
        <Link to={`/products/${id}`}>
          <h3 className="text-lg font-bold text-white leading-tight hover:text-accent transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <ProductFeedback productId={id} compact />
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 line-through">${(price * 1.2).toFixed(2)}</span>
          <span className="text-xl font-bold text-white">${price.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          aria-label={`Add ${name} to cart`}
          className={`p-3 rounded-xl transition-all duration-300 transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 group-hover:shadow-[0_0_15px_rgba(10,132,255,0.5)] ${
            isAdded
              ? "bg-green-500 text-white"
              : "bg-primary/20 hover:bg-primary text-primary hover:text-white"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleCompare}
        className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-gray-200 transition-colors hover:border-accent/50 hover:text-white"
      >
        Compare
      </button>
      <CartNotice show={showNotice} message={`${name} u shtua ne shporte.`} />
      <CartNotice show={Boolean(compareNotice)} message={compareNotice} />
    </motion.div>
  );
}
