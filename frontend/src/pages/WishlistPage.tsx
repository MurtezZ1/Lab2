import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setWishlistItems } from "@/redux/slices/wishlistSlice";
import { getWishlist } from "@/services/wishlistService";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const user = useAppSelector((state) => state.auth.user);
  const items = useAppSelector((state) => state.wishlist.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    getWishlist(user).then((items) => {
      if (active) dispatch(setWishlistItems(items));
    });
    return () => {
      active = false;
    };
  }, [dispatch, user]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Heart className="w-8 h-8 text-primary" />
        Wishlist
      </h1>
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you like and come back later to compare, buy, or track price changes."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      )}
    </div>
  );
}
