import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cartSlice";
import { setOrders } from "@/redux/slices/ordersSlice";
import { createOrder, getOrders } from "@/services/orderService";
import { getCartSummary, saveCartItems } from "@/services/cartService";
import { formatPrice } from "@/utils/products";
import { ArrowRight, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const user = useAppSelector((state) => state.auth.user);
  const items = useAppSelector((state) => state.cart.items);
  const summary = getCartSummary(items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const placeOrder = () => {
    createOrder(user, items, summary.total);
    saveCartItems(user, []);
    dispatch(setCartItems([]));
    dispatch(setOrders(getOrders(user)));
    navigate("/orders");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-primary" />
        Checkout
      </h1>
      <div className="grid lg:grid-cols-[1fr_420px] gap-8">
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-xl font-bold text-white">Shipping Details</h2>
          {["Full Name", "Address", "City", "Postal Code"].map((label) => (
            <label key={label} className="block">
              <span className="text-sm text-gray-300">{label}</span>
              <input className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
            </label>
          ))}
        </div>
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-white">{formatPrice(summary.subtotal)}</span></div>
            <div className="flex justify-between text-gray-400"><span>Tax</span><span className="text-white">{formatPrice(summary.tax)}</span></div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between text-lg font-bold text-white"><span>Total</span><span className="text-primary">{formatPrice(summary.total)}</span></div>
          </div>
          <button onClick={placeOrder} disabled={items.length === 0} className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50">
            Place Order <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
