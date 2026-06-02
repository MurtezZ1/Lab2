import { useAppSelector } from "@/redux/hooks";
import { LayoutDashboard, Package, Heart, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDashboardPage() {
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const wishlistCount = useAppSelector((state) => state.wishlist.items.length);
  const notifications = useAppSelector((state) => state.notifications.items.filter((item) => item.unread).length);

  const cards = [
    ["Cart Items", cartCount, "/cart", Package],
    ["Wishlist", wishlistCount, "/wishlist", Heart],
    ["Notifications", notifications, "/notifications", Bell],
  ] as const;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-primary" />
        User Dashboard
      </h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(([title, value, href, Icon]) => (
          <Link key={title} to={href} className="glass-card rounded-2xl p-6">
            <Icon className="w-7 h-7 text-primary" />
            <p className="mt-6 text-sm text-gray-400">{title}</p>
            <h2 className="text-3xl font-black text-white">{value}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
