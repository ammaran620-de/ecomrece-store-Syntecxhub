"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Search, Menu, X, User, ShieldAlert, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function Header() {
  const { items, toggleCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Click outside to collapse search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchExpanded(false);
      setSearchQuery("");
    }
  };

  const focusSearch = () => {
    setSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-void/80 backdrop-blur-xl border-b border-border-dim shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-[76px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-display font-bold text-text-primary flex items-center gap-2 tracking-tight group">
          <div className="relative w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-black text-sm font-display">S</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary to-accent-ice opacity-50 mix-blend-overlay"></div>
          </div>
          <span className="tracking-[0.15em] font-extrabold text-lg text-white group-hover:text-accent-ice transition-colors">AURA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-[14px] uppercase tracking-wider font-medium text-text-secondary">
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="text-accent-gold hover:text-white transition-colors flex items-center gap-1">
              <ShieldAlert size={14} /> Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Expanding Search Bar */}
          <div ref={searchContainerRef} className="relative flex items-center">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <motion.div
                initial={false}
                animate={{ width: searchExpanded ? 240 : 0, opacity: searchExpanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden mr-2"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="SEARCH CATALOGUE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-chrome/50 border border-border-dim rounded-full py-1.5 px-4 text-xs font-mono tracking-wide text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20"
                />
              </motion.div>
              
              <button
                type="button"
                onClick={searchExpanded ? handleSearchSubmit : focusSearch}
                className="p-2 hover:bg-chrome/50 rounded-full text-text-secondary hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Cart Icon */}
          <button 
            onClick={toggleCart} 
            className="p-2 hover:bg-chrome/50 rounded-full text-text-secondary hover:text-white transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-accent-primary text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border border-void"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* User Session */}
          {session ? (
            <div className="flex items-center gap-4 border-l border-border-dim pl-4">
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-white transition-colors text-text-secondary text-xs font-mono uppercase">
                <User size={16} className="text-accent-ice" />
                <span>Account</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-text-muted hover:text-destructive transition-colors"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-5 py-2 border border-border-dim hover:border-accent-primary text-text-primary text-xs uppercase font-semibold rounded-lg hover:bg-chrome/20 transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Actions & Menu Toggle */}
        <div className="flex md:hidden items-center space-x-3">
          <button 
            onClick={toggleCart} 
            className="p-2 text-text-secondary hover:text-white transition-colors relative"
          >
            <ShoppingBag size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-primary text-white text-[8px] font-mono rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          
          <button className="p-2 text-text-secondary" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-dim bg-void/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col space-y-6 text-sm uppercase tracking-widest font-medium">
              <Link href="/shop" onClick={() => setIsOpen(false)} className="hover:text-accent-primary transition-colors py-2">Shop</Link>
              <Link href="/faqs" onClick={() => setIsOpen(false)} className="hover:text-accent-primary transition-colors py-2">FAQs</Link>
              {session?.user?.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-accent-gold py-2">Admin Panel</Link>
              )}
              <hr className="border-border-dim" />
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-accent-primary py-2 flex items-center gap-2">
                    <User size={16} /> My Account
                  </Link>
                  <button 
                    onClick={() => { signOut({ callbackUrl: "/" }); setIsOpen(false); }}
                    className="text-left text-text-muted hover:text-destructive py-2 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 bg-accent-primary text-white font-semibold rounded-lg"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
