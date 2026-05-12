"use client";

import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background/80 backdrop-blur-xl border-l border-border z-50 flex flex-col glass shadow-2xl"
          >
            <div className="p-6 flex justify-between items-center border-b border-border">
              <h2 className="text-xl font-display flex items-center gap-2">
                <ShoppingBag size={20} />
                Your Cart
              </h2>
              <button onClick={closeCart} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                  <button onClick={closeCart} className="mt-6 underline hover:text-foreground">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 bg-muted relative overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-foreground">
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground uppercase mt-1">Variant: {item.variant}</p>
                        <p className="font-mono mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center border border-border w-fit">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-muted"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {items.length > 0 && (
                <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg">
                  <p className="text-xs font-medium uppercase tracking-widest mb-2 text-muted-foreground">Customers also bought</p>
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=100" className="w-12 h-12 object-cover" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Leather Conditioner</p>
                      <p className="font-mono text-xs">$25.00</p>
                    </div>
                    <button className="px-3 py-1 bg-foreground text-background text-xs uppercase tracking-wider font-medium">Add</button>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-background/50 backdrop-blur-md">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">Shipping and taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full py-4 bg-foreground text-background font-medium tracking-wide uppercase hover:bg-zinc-800 transition-colors">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
