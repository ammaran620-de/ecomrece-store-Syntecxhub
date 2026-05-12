"use client";

import { useCartStore } from "@/stores/cartStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [step, setStep] = useState<"address" | "shipping" | "payment">("address");
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Checkout Flow */}
        <div className="lg:col-span-7 lg:col-start-2">
          <div className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
            <span className={step === "address" ? "text-foreground font-medium" : ""}>Address</span>
            <ChevronRight size={14} />
            <span className={step === "shipping" ? "text-foreground font-medium" : ""}>Shipping</span>
            <ChevronRight size={14} />
            <span className={step === "payment" ? "text-foreground font-medium" : ""}>Payment</span>
          </div>

          <div className="bg-background border border-border p-8 shadow-sm">
            {step === "address" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-display mb-6">Shipping Address</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("shipping"); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">First Name</label>
                      <input type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground transition-colors" required />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Last Name</label>
                      <input type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground transition-colors" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Address (Google Places Autocomplete here)</label>
                    <input type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground transition-colors" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Zip</label>
                      <input type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground transition-colors" required />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">City</label>
                      <input type="text" className="w-full border border-border bg-transparent p-3 focus:outline-none focus:border-foreground transition-colors" required />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-foreground text-background py-4 mt-8 uppercase tracking-widest font-medium hover:bg-zinc-800 transition-colors">
                    Continue to Shipping
                  </button>
                </form>
              </motion.div>
            )}

            {step === "shipping" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-display mb-6">Shipping Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-foreground bg-muted/50 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="shipping" defaultChecked className="accent-foreground" />
                      <span>Standard Shipping (3-5 days)</span>
                    </div>
                    <span className="font-mono">Free</span>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-border hover:border-foreground cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <input type="radio" name="shipping" className="accent-foreground" />
                      <span>Express Shipping (1-2 days)</span>
                    </div>
                    <span className="font-mono">$15.00</span>
                  </label>
                </div>
                <div className="flex space-x-4 mt-8">
                  <button onClick={() => setStep("address")} className="w-1/3 border border-border py-4 uppercase tracking-widest font-medium hover:bg-muted transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep("payment")} className="w-2/3 bg-foreground text-background py-4 uppercase tracking-widest font-medium hover:bg-zinc-800 transition-colors">
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-display mb-6">Payment</h2>
                <div className="p-8 border border-border border-dashed text-center mb-8">
                  <p className="text-muted-foreground mb-2">Stripe Payment Element would render here</p>
                  <div className="flex justify-center space-x-2 text-xs text-muted-foreground">
                    <span className="flex items-center"><ShieldCheck size={14} className="mr-1"/> Secure Encrypted Checkout</span>
                  </div>
                </div>
                
                {/* Order Bump */}
                <div className="bg-primary/5 border border-primary/20 p-4 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="flex items-start space-x-4">
                    <input type="checkbox" className="mt-1 accent-primary" />
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 uppercase tracking-wider">Offer</span>
                        Add Premium Packaging
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">Make it a gift. Includes signature box and handwritten note. <span className="font-mono text-foreground">+$15.00</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button onClick={() => setStep("shipping")} className="w-1/3 border border-border py-4 uppercase tracking-widest font-medium hover:bg-muted transition-colors">
                    Back
                  </button>
                  <button className="w-2/3 bg-foreground text-background py-4 uppercase tracking-widest font-medium hover:bg-zinc-800 transition-colors">
                    Pay ${total.toFixed(2)}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-background border border-border p-6 sticky top-24">
            <h3 className="font-display text-xl mb-6 border-b border-border pb-4">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex space-x-4">
                  <div className="w-16 h-20 bg-muted flex-shrink-0 relative">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background rounded-full text-xs flex items-center justify-center font-mono">{item.quantity}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase">{item.variant}</p>
                    <p className="font-mono text-sm mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-muted-foreground text-sm">Cart is empty.</p>}
            </div>
            
            <div className="space-y-3 text-sm border-t border-border pt-4 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-xs uppercase">Calculated next step</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-xs uppercase">Calculated next step</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 flex justify-between items-center text-lg">
              <span>Total</span>
              <span className="font-mono font-medium text-xl">
                <span className="text-xs text-muted-foreground mr-1">USD</span>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
