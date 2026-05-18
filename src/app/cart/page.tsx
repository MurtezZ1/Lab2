import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-primary" />
        Shopping Cart
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items (Mocked for UI demo) */}
        <div className="flex-1 space-y-6">
          {[1, 2].map((item) => (
            <div key={item} className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 relative group">
              <div className="w-24 h-24 relative bg-white/5 rounded-xl p-2 shrink-0">
                <Image src="https://m.media-amazon.com/images/I/41MOVNsGMbL.jpg" alt="Product" fill className="object-contain" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white">Premium Smartwatch Series X</h3>
                <p className="text-sm text-gray-400 mt-1">Color: Midnight Black</p>
                <div className="text-xl font-bold text-primary mt-2">$299.00</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-black/50 rounded-lg border border-white/10">
                  <button className="px-3 py-1 text-gray-400 hover:text-white">-</button>
                  <span className="px-3 py-1 text-white text-sm font-medium border-x border-white/10">1</span>
                  <button className="px-3 py-1 text-gray-400 hover:text-white">+</button>
                </div>
                <button className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card p-8 rounded-3xl sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">$598.00</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span className="text-white">$47.84</span>
              </div>
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="text-primary">$645.84</span>
              </div>
            </div>

            <button className="w-full mt-8 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors hover:shadow-[0_0_20px_rgba(10,132,255,0.3)] flex items-center justify-center gap-2">
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
