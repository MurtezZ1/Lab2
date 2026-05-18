"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Cpu } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-white/5 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Cpu className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            SUN<span className="text-primary">SPOT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/deals">Deals</NavLink>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <Search className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors cursor-pointer" />
            <div className="absolute right-0 top-10 w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity glass p-2 rounded-xl border border-white/10">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-black/50 text-white text-sm px-4 py-2 rounded-lg outline-none border border-white/10 focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
          
          <Link href="/account" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</MobileNavLink>
              <MobileNavLink href="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</MobileNavLink>
              <MobileNavLink href="/deals" onClick={() => setIsMobileMenuOpen(false)}>Deals</MobileNavLink>
              <div className="h-px bg-white/10 my-2" />
              <MobileNavLink href="/cart" onClick={() => setIsMobileMenuOpen(false)}>Cart (0)</MobileNavLink>
              <MobileNavLink href="/account" onClick={() => setIsMobileMenuOpen(false)}>Account</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-gray-300 hover:text-white hover:text-gradient transition-all relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full rounded-full" />
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="text-gray-300 hover:text-white text-lg font-medium">
      {children}
    </Link>
  );
}
