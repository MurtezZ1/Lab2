import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Cpu, Bell, GitCompareArrows, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppSelector } from "@/redux/hooks";

const searchSuggestions = ["iPhone", "Laptop", "Headphones", "Gaming", "Samsung", "3D products"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const compareCount = useAppSelector((state) => state.compare.items.length);
  const unreadCount = useAppSelector((state) => state.notifications.items.filter((item) => item.unread).length);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.roles?.some((role) => role.toLowerCase() === "admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(searchTerm);
  };

  const runSearch = (value: string) => {
    const nextValue = value.trim();
    navigate(nextValue ? `/products?search=${encodeURIComponent(nextValue)}` : "/products");
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setSearchTerm(nextValue);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-white/5 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Cpu className="w-6 h-6 text-accent" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            SUN<span className="text-primary">SPOT</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/3d-models">3D Models</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/deals">Deals</NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <div ref={searchRef} className="relative">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setIsSearchOpen((open) => !open)}
              className="text-gray-400 transition-colors hover:text-primary"
            >
              <Search className="w-5 h-5" />
            </button>
            <div
              className={`glass absolute right-0 top-10 w-80 rounded-2xl border border-white/10 p-4 shadow-2xl transition-all ${
                isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <form onSubmit={submitSearch}>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-gray-500">
                  Search products
                </label>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Try iPhone, laptop, headphones..."
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
                />
              </form>
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase text-gray-500">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => runSearch(suggestion)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-gray-300 transition-colors hover:border-primary/40 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link to="/cart" className="relative group">
            <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <Link to="/compare" className="relative group" aria-label={`Compare ${compareCount} products`}>
            <GitCompareArrows className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
            {compareCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          <Link to="/notifications" className="relative group">
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}

          <ThemeToggle />

          <Link to="/account" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>

        <button
          className="lg:hidden text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</MobileNavLink>
              <MobileNavLink to="/3d-models" onClick={() => setIsMobileMenuOpen(false)}>3D Models</MobileNavLink>
              <MobileNavLink to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</MobileNavLink>
              <MobileNavLink to="/deals" onClick={() => setIsMobileMenuOpen(false)}>Deals</MobileNavLink>
              <form onSubmit={submitSearch}>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Try iPhone, laptop, headphones..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-primary"
                />
              </form>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => runSearch(suggestion)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-gray-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <div className="h-px bg-white/10 my-2" />
              <MobileNavLink to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Cart ({cartCount})</MobileNavLink>
              <MobileNavLink to="/compare" onClick={() => setIsMobileMenuOpen(false)}>Compare ({compareCount})</MobileNavLink>
              <MobileNavLink to="/notifications" onClick={() => setIsMobileMenuOpen(false)}>Notifications ({unreadCount})</MobileNavLink>
              {isAdmin && <MobileNavLink to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</MobileNavLink>}
              <ThemeToggle showLabel className="w-fit px-3" />
              <MobileNavLink to="/account" onClick={() => setIsMobileMenuOpen(false)}>Account</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm font-medium text-gray-300 hover:text-white hover:text-gradient transition-all relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full rounded-full" />
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick} className="text-gray-300 hover:text-white text-lg font-medium">
      {children}
    </Link>
  );
}
