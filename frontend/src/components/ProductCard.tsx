import CartNotice from "@/components/CartNotice";
import ProductFeedback from "@/components/ProductFeedback";
import { motion } from "framer-motion";
import { Box, GitCompareArrows, Heart, ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cartSlice";
import { addToCompare } from "@/redux/slices/compareSlice";
import { setWishlistItems } from "@/redux/slices/wishlistSlice";
import { addProductToCart } from "@/services/cartService";
import { toggleWishlist } from "@/services/wishlistService";
import type { Product } from "@/types";
import { calculateDemandForecast } from "@/utils/demandForecast";
import { hasVerifiedProduct3DModel } from "@/utils/product3dModels";

interface ProductProps {
  id: number | string;
  uuid?: string;
  name: string;
  price: number;
  image: string;
  manufacturer: string;
  rating_average?: number;
  discount_percentage?: number;
  stock_quantity?: number;
  aiProductScore?: number;
  recommendationScore?: number;
  similarityScore?: number;
}

export default function ProductCard({
  id,
  uuid,
  name,
  price,
  image,
  manufacturer,
  rating_average = 0,
  discount_percentage = 0,
  stock_quantity = 0,
  aiProductScore,
  recommendationScore,
  similarityScore,
}: ProductProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [compareNotice, setCompareNotice] = useState("");
  const [isPending, startTransition] = useTransition();
  const user = useAppSelector((state) => state.auth.user);
  const compareItems = useAppSelector((state) => state.compare.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const has3DModel = hasVerifiedProduct3DModel(name);
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
    rating_average,
    discount_percentage,
    stock_quantity,
    aiProductScore,
    recommendationScore,
    similarityScore,
  };
  const demand = calculateDemandForecast(product);
  const badges = getSmartBadges({
    has3DModel,
    demandLevel: demand.level,
    stockQuantity: stock_quantity,
    discountPercentage: discount_percentage,
    aiScore: Number(aiProductScore ?? recommendationScore ?? similarityScore ?? 0),
  });

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
      whileHover={{ y: -6 }}
      className="glass-card group relative flex h-full min-h-[31rem] flex-col gap-4 overflow-hidden rounded-2xl p-4"
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

      <Link to={`/products/${id}`} className="relative block h-52 w-full shrink-0 overflow-hidden rounded-xl bg-white/5">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute left-3 top-3 flex min-h-6 max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
          {badges.map((badge) => (
            <span key={badge.label} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wide backdrop-blur ${badge.className}`}>
              {badge.icon === "3d" && <Box className="h-3 w-3" />}
              {badge.label}
            </span>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex min-h-[8.5rem] flex-1 flex-col gap-1">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{manufacturer}</span>
        <Link to={`/products/${id}`}>
          <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-tight text-white transition-colors hover:text-accent">
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

function getSmartBadges({
  has3DModel,
  demandLevel,
  stockQuantity,
  discountPercentage,
  aiScore,
}: {
  has3DModel: boolean;
  demandLevel: "High" | "Medium" | "Low";
  stockQuantity: number;
  discountPercentage: number;
  aiScore: number;
}) {
  const badges: Array<{ label: string; className: string; icon?: "3d" }> = [];

  if (has3DModel) {
    badges.push({
      label: "3D View",
      icon: "3d",
      className: "border-primary/30 bg-black/70 text-primary",
    });
  }
  if (demandLevel === "High") {
    badges.push({
      label: "High Demand",
      className: "border-green-400/30 bg-green-500/15 text-green-200",
    });
  }
  if (stockQuantity > 0 && stockQuantity <= 5) {
    badges.push({
      label: `Only ${stockQuantity} left`,
      className: "border-red-400/30 bg-red-500/15 text-red-200",
    });
  }
  if (discountPercentage >= 10) {
    badges.push({
      label: "Best Value",
      className: "border-yellow-400/30 bg-yellow-500/15 text-yellow-100",
    });
  }
  if (aiScore >= 70 && badges.length < 3) {
    badges.push({
      label: "AI Pick",
      className: "border-accent/30 bg-accent/15 text-accent",
    });
  }
  if (badges.length === 0) {
    badges.push({
      label: "Smart Pick",
      className: "border-white/15 bg-white/10 text-gray-200",
    });
  }

  return badges.slice(0, 3);
}
