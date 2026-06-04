"use client";

import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Heart, Trash2, Tag, Percent } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export function CartDrawer() {
  const { 
    items, 
    savedItems, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    saveForLater, 
    moveToCart, 
    removeSaved 
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<number | null>(null); // percentage off
  const [shakeCode, setShakeCode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discountApplied ? subtotal * (discountApplied / 100) : 0;
  const shippingTarget = 300;
  const shippingCost = subtotal - discountAmount > shippingTarget ? 0 : 15;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === "AURA20") {
      setDiscountApplied(20);
    } else {
      setShakeCode(true);
      setTimeout(() => setShakeCode(false), 500);
    }
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-void border-l border-border-dim z-50 flex flex-col glass-panel shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-border-dim bg-obsidian">
              <h2 className="text-xl font-display font-extrabold flex items-center gap-3 text-white">
                <ShoppingBag size={20} className="text-accent-primary" />
                <span>YOUR ARCHIVE</span>
              </h2>
              <button 
                onClick={closeCart} 
                className="p-2 hover:bg-chrome rounded-full text-text-secondary hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrolling item list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              
              {/* Shipping Target Progress */}
              {items.length > 0 && (
                <div className="border-b border-border-dim pb-4 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-secondary">
                      {subtotal >= shippingTarget 
                        ? "FREE WORLDWIDE COURIER ENABLED" 
                        : `ADD $${(shippingTarget - subtotal).toFixed(2)} FOR FREE SHIPPING`}
                    </span>
                    <span className="text-accent-gold font-bold">{subtotal >= shippingTarget ? "100%" : `${Math.round((subtotal / shippingTarget) * 100)}%`}</span>
                  </div>
                  <div className="h-1.5 w-full bg-chrome rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-primary transition-all duration-500" 
                      style={{ width: `${Math.min(100, (subtotal / shippingTarget) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cart List */}
              {items.length === 0 ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={48} className="text-text-muted opacity-20 animate-bounce" />
                  <p className="text-sm font-mono text-text-secondary">YOUR ARCHIVE CONTAINER IS EMPTY.</p>
                  <button 
                    onClick={closeCart} 
                    className="px-6 py-2.5 bg-accent-primary text-white font-mono text-xs tracking-widest rounded-lg"
                  >
                    CONTINUE LOOKUP
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] text-text-muted uppercase">ARCHIVE RELEASES ({items.length})</h3>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 border-b border-border-dim/40 pb-4 overflow-hidden"
                      >
                        <div className="w-20 h-24 bg-chrome rounded-lg overflow-hidden flex-shrink-0 border border-border-dim">
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                              <button 
                                onClick={() => removeItem(item.id)} 
                                className="text-text-muted hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <span className="text-[9px] font-mono text-text-muted block mt-1 uppercase">VARIANT: {item.variant}</span>
                            <span className="text-xs font-mono text-accent-gold block mt-2">${item.price}</span>
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            {/* Stepper */}
                            <div className="flex items-center border border-border-dim rounded bg-chrome">
                              <button 
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-1 text-text-muted hover:text-white"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="px-3 text-xs font-mono text-white font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-text-muted hover:text-white"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            {/* Save for later trigger */}
                            <button 
                              onClick={() => saveForLater(item.id)}
                              className="text-[10px] font-mono text-accent-ice hover:underline flex items-center gap-1"
                            >
                              <Heart size={10} />
                              <span>SAVE FOR LATER</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Saved For Later items Section */}
              {savedItems.length > 0 && (
                <div className="border-t border-border-dim pt-6 space-y-4">
                  <h3 className="text-[10px] font-mono tracking-[0.2em] text-text-muted uppercase">SAVED FOR LATER ({savedItems.length})</h3>
                  <div className="space-y-4">
                    {savedItems.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-border-dim/40 pb-4">
                        <div className="w-16 h-20 bg-chrome rounded-lg overflow-hidden flex-shrink-0 opacity-70 border border-border-dim">
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        </div>

                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-text-secondary leading-tight">{item.name}</h4>
                            <span className="text-xs font-mono text-accent-gold block mt-1">${item.price}</span>
                          </div>

                          <div className="flex gap-4 text-[10px] font-mono mt-2">
                            <button 
                              onClick={() => moveToCart(item.id)}
                              className="text-accent-primary hover:underline"
                            >
                              MOVE TO CART
                            </button>
                            <button 
                              onClick={() => removeSaved(item.id)}
                              className="text-text-muted hover:text-white"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Cart Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border-dim bg-obsidian/90 space-y-6">
                
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyDiscount} className="flex gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="text" 
                      placeholder="ENTER COUPON CODE" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className={`w-full bg-void border rounded-lg py-2.5 pl-9 pr-4 text-xs font-mono tracking-wider focus:outline-none focus:border-accent-primary ${
                        shakeCode ? "border-red-500 animate-shake" : "border-border-dim"
                      }`}
                    />
                    <Tag size={12} className="absolute left-3 top-3.5 text-text-muted" />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="px-4 py-2.5 bg-chrome hover:bg-void border border-border-dim rounded-lg text-xs font-mono text-white tracking-widest uppercase cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>

                {/* Subtotals list */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-text-secondary">
                    <span>SUBTOTAL</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discountApplied && (
                    <div className="flex justify-between text-accent-gold">
                      <span className="flex items-center gap-1">
                        <Percent size={10} /> DISCOUNT (AURA20)
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-text-secondary">
                    <span>COURIER SHIPPING</span>
                    <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>

                  <hr className="border-border-dim/40 my-2" />

                  <div className="flex justify-between text-sm font-bold text-white">
                    <span>TOTAL ESTIMATED</span>
                    <span className="text-accent-gold">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  onClick={closeCart}
                  className="w-full py-4 bg-accent-primary hover:bg-opacity-95 text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/5 flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer text-center justify-center"
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
