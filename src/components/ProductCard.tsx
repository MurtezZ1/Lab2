"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string;
  manufacturer: string;
}

export default function ProductCard({ id, name, price, image, manufacturer }: ProductProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="glass-card rounded-2xl p-4 flex flex-col gap-4 group relative overflow-hidden"
    >
      {/* Quick Actions - hidden by default, visible on hover */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-4 group-hover:translate-x-0 duration-300">
        <button className="bg-white/10 hover:bg-primary text-white p-2 rounded-full backdrop-blur-md transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <Link href={`/products/${id}`} className="block relative w-full h-48 rounded-xl overflow-hidden bg-white/5">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{manufacturer}</span>
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-bold text-white leading-tight hover:text-accent transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        
        {/* Rating Mock */}
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 fill-accent text-accent" />
          ))}
          <span className="text-xs text-gray-400 ml-1">(24)</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 line-through">${(price * 1.2).toFixed(2)}</span>
          <span className="text-xl font-bold text-white">${price.toFixed(2)}</span>
        </div>
        <button className="bg-primary/20 hover:bg-primary text-primary hover:text-white p-3 rounded-xl transition-all duration-300 transform active:scale-95 group-hover:shadow-[0_0_15px_rgba(10,132,255,0.5)]">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
