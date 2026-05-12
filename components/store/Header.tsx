"use client";

import Link from "next/link";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useEffect, useState } from "react";

export function Header() {
  const { openCart, items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 h-20 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <button className="md:hidden p-2">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="font-display text-2xl tracking-[0.2em] font-bold z-50">
          AURA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-muted-foreground transition-colors">Collection</Link>
          <Link href="#" className="hover:text-muted-foreground transition-colors">Editorial</Link>
          <Link href="#" className="hover:text-muted-foreground transition-colors">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6 z-50">
          <button className="hover:text-muted-foreground transition-colors">
            <Search size={20} />
          </button>
          <Link href="/dashboard" className="hover:text-muted-foreground transition-colors hidden md:block">
            <User size={20} />
          </Link>
          <button onClick={openCart} className="hover:text-muted-foreground transition-colors relative">
            <ShoppingBag size={20} />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center rounded-full font-mono">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
