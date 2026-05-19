import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import {
  addToCartFromForm,
  removeOneFromCartFromForm,
  removeProductFromCartFromForm,
} from "./actions";
import { getCurrentCart } from "@/lib/cart";

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export default async function CartPage() {
  const cart = await getCurrentCart();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-primary" />
        Shopping Cart
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {!cart.user && (
            <div className="glass-card p-8 rounded-2xl text-center">
              <h2 className="text-xl font-bold text-white">Sign in to use your cart</h2>
              <p className="mt-2 text-gray-400">Your cart is saved in your account so it stays connected to the database.</p>
              <Link href="/account" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/90">
                Go to Account
              </Link>
            </div>
          )}

          {cart.user && cart.items.length === 0 && (
            <div className="glass-card p-8 rounded-2xl text-center">
              <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
              <p className="mt-2 text-gray-400">Add a product and it will appear here.</p>
              <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/90">
                Browse Products
              </Link>
            </div>
          )}

          {cart.items.map((item) => (
            <div key={item.productId} className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 relative group">
              <Link href={`/products/${item.productId}`} className="w-24 h-24 relative bg-white/5 rounded-xl p-2 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-contain" sizes="96px" />
              </Link>
              <div className="flex-1 text-center sm:text-left">
                <Link href={`/products/${item.productId}`} className="text-lg font-bold text-white hover:text-primary transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-400 mt-1">Unit price: {formatPrice(item.price)}</p>
                <div className="text-xl font-bold text-primary mt-2">{formatPrice(item.subtotal)}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-black/50 rounded-lg border border-white/10">
                  <form action={removeOneFromCartFromForm.bind(null, item.productId)}>
                    <button type="submit" className="px-3 py-1 text-gray-400 hover:text-white" aria-label={`Remove one ${item.name}`}>
                      -
                    </button>
                  </form>
                  <span className="px-3 py-1 text-white text-sm font-medium border-x border-white/10">{item.quantity}</span>
                  <form action={addToCartFromForm.bind(null, item.productId)}>
                    <button type="submit" className="px-3 py-1 text-gray-400 hover:text-white" aria-label={`Add one ${item.name}`}>
                      +
                    </button>
                  </form>
                </div>
                <form action={removeProductFromCartFromForm.bind(null, item.productId)}>
                  <button type="submit" className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors" aria-label={`Remove ${item.name} from cart`}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card p-8 rounded-3xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span className="text-white">{formatPrice(cart.tax)}</span>
              </div>
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="text-primary">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <button disabled={!cart.user || cart.items.length === 0} className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors hover:shadow-[0_0_20px_rgba(10,132,255,0.3)] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Secure checkout. We do not store your credit card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
