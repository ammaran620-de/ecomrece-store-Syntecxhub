"use client";

export const dynamic = "force-dynamic";

import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { ChevronRight, ShieldCheck, CreditCard, CheckCircle2, ShoppingBag, Truck, MapPin, ArrowRight, Loader2, Star, Phone, DollarSign, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CheckoutContent() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  // Active step state: "shipping" | "payment" | "success"
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);

  // Address inputs
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("Karachi");
  const [zip, setZip] = useState("75300");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  // Payment method: "COD" | "CARD"
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");

  // Address autocomplete dropdown state
  const [addressQuery, setAddressQuery] = useState("");
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  
  // Credit card inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [packagingOpt, setPackagingOpt] = useState(false);

  // Summary items backup for success view
  const [placedItems, setPlacedItems] = useState<any[]>([]);

  // Capture cart items when placing order
  useEffect(() => {
    if (items.length > 0 && placedItems.length === 0) {
      setPlacedItems(items);
    }
  }, [items]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? 15 : (subtotal > 300 ? 0 : 15);
  const packagingCost = packagingOpt ? 15 : 0;
  const total = subtotal + shippingCost + packagingCost;

  // Mock address autocomplete suggestions
  const mockSuggestions = [
    { line1: "Sector 15, DHA Phase 6", city: "Karachi", zip: "75500" },
    { line1: "Gulberg Road, Near Liberty Market", city: "Lahore", zip: "54000" },
    { line1: "Sector F-7/2, Street 14", city: "Islamabad", zip: "44000" },
    { line1: "Karsaz Road, Tech District", city: "Karachi", zip: "75350" }
  ];

  const filteredSuggestions = addressQuery.length > 2 
    ? mockSuggestions.filter(s => s.line1.toLowerCase().includes(addressQuery.toLowerCase()))
    : [];

  const handleSelectAddress = (s: typeof mockSuggestions[0]) => {
    setAddressLine1(s.line1);
    setCity(s.city);
    setZip(s.zip);
    setAddressQuery(s.line1);
    setShowAddressDropdown(false);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !addressLine1 || !phone) return;
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: fullName,
          phone,
          addressLine1,
          city,
          zip,
          items: placedItems,
          paymentMethod,
          shippingMethod,
          packagingOpt,
          discountCode: ""
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setOrderNumber(resData.order.id);
        setFinalTotal(resData.order.total);
        setStep("success");
        clearCart();
      } else {
        alert(resData.error || "Order placement failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while placing your order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 text-text-primary">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Flow forms (7 cols) */}
        <div className="lg:col-span-7">
          
          {/* Breadcrumb Steps */}
          <div className="mb-10 flex items-center space-x-3 text-xs font-mono tracking-widest text-text-muted">
            <span className={step === "shipping" ? "text-accent-primary font-bold" : "text-text-secondary"}>SHIPPING</span>
            <ChevronRight size={10} />
            <span className={step === "payment" ? "text-accent-primary font-bold" : "text-text-secondary"}>PAYMENT</span>
            <ChevronRight size={10} />
            <span className={step === "success" ? "text-accent-gold font-bold" : "text-text-secondary"}>RECEIPT</span>
          </div>

          <div className="bg-obsidian border border-border-dim rounded-2xl p-8 glass-panel shadow-2xl relative">
            <AnimatePresence mode="wait">
              {step === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-display font-extrabold text-white mb-8">SHIPPING DETAILS</h2>
                  <form className="space-y-6" onSubmit={handleShippingSubmit}>
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">FULL NAME</label>
                      <input 
                        type="text" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alexander Raza" 
                        className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">EMAIL ADDRESS</label>
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="customer@aura.com" 
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">PHONE NUMBER</label>
                        <input 
                          type="tel" 
                          required 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0300 1234567" 
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                      </div>
                    </div>

                    {/* Address Autocomplete input */}
                    <div className="relative">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">DELIVERY STREET ADDRESS</label>
                      <input 
                        type="text" 
                        required 
                        value={addressQuery}
                        onChange={(e) => {
                          setAddressQuery(e.target.value);
                          setAddressLine1(e.target.value);
                          setShowAddressDropdown(true);
                        }}
                        placeholder="Start typing your address (DHA Phase 6, Gulberg...)" 
                        className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                      />
                      
                      {/* Autocomplete suggestions dropdown */}
                      {showAddressDropdown && filteredSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 mt-2 bg-chrome border border-border-dim rounded-lg shadow-xl z-20 overflow-hidden font-mono text-xs">
                          {filteredSuggestions.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectAddress(s)}
                              className="w-full text-left p-3 hover:bg-accent-primary/20 border-b border-border-dim/50 text-text-secondary hover:text-white flex items-center gap-2"
                            >
                              <MapPin size={12} className="text-accent-primary" />
                              <span>{s.line1}, {s.city}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* City & Zip */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">CITY</label>
                        <input 
                          type="text" 
                          required 
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">ZIP / POSTAL CODE</label>
                        <input 
                          type="text" 
                          required 
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                      </div>
                    </div>

                    {/* Shipping Method choices */}
                    <div className="space-y-4 pt-4">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted">DELIVERY TYPE</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setShippingMethod("standard")}
                          className={`p-4 border rounded-xl flex justify-between items-center text-left transition-all ${
                            shippingMethod === "standard" ? "border-accent-primary bg-accent-primary/5" : "border-border-dim hover:border-text-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Truck size={18} className="text-accent-ice" />
                            <div>
                              <span className="text-sm font-bold text-white block">Standard Courier</span>
                              <span className="text-[10px] text-text-muted font-mono">3-5 business days</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-accent-gold">FREE</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShippingMethod("express")}
                          className={`p-4 border rounded-xl flex justify-between items-center text-left transition-all ${
                            shippingMethod === "express" ? "border-accent-primary bg-accent-primary/5" : "border-border-dim hover:border-text-secondary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Truck size={18} className="text-accent-primary animate-pulse" />
                            <div>
                              <span className="text-sm font-bold text-white block">Express Priority</span>
                              <span className="text-[10px] text-text-muted font-mono">1-2 business days</span>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-accent-gold">$15.00</span>
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/5 flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer pt-4 hover:bg-opacity-95"
                    >
                      <span>CONTINUE TO PAYMENT</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-2xl font-display font-extrabold text-white mb-8">CHOOSE PAYMENT METHOD</h2>
                  <form className="space-y-6" onSubmit={handlePaymentSubmit}>
                    
                    {/* Daraz Style Payment Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("COD")}
                        className={`p-5 border rounded-xl flex flex-col justify-between text-left transition-all relative ${
                          paymentMethod === "COD" ? "border-accent-primary bg-accent-primary/5" : "border-border-dim hover:border-text-secondary"
                        }`}
                      >
                        <span className="absolute top-3 right-3 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                          Recommended
                        </span>
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign size={20} className="text-green-400" />
                          <span className="text-sm font-bold text-white">Cash on Delivery</span>
                        </div>
                        <span className="text-[10px] text-text-muted font-mono leading-relaxed">
                          Pay in cash upon dispatch arrival. Zero processing fees.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("CARD")}
                        className={`p-5 border rounded-xl flex flex-col justify-between text-left transition-all ${
                          paymentMethod === "CARD" ? "border-accent-primary bg-accent-primary/5" : "border-border-dim hover:border-text-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard size={20} className="text-accent-primary" />
                          <span className="text-sm font-bold text-white">Credit / Debit Card</span>
                        </div>
                        <span className="text-[10px] text-text-muted font-mono leading-relaxed">
                          Secure instant checkout via Stripe processing gateway.
                        </span>
                      </button>
                    </div>

                    {paymentMethod === "CARD" ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-chrome/50 border border-border-dim rounded-xl p-6 space-y-4"
                      >
                        <div className="flex justify-between items-center text-xs font-mono text-text-muted mb-2">
                          <span>CREDIT CARD ROUTING</span>
                          <CreditCard size={14} className="text-accent-primary" />
                        </div>
                        
                        <div>
                          <label className="block text-[9px] font-mono text-text-muted mb-1 uppercase">Card Number</label>
                          <input 
                            type="text" 
                            required 
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-void border border-border-dim rounded-lg p-3 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono text-text-muted mb-1 uppercase">Expiry Date</label>
                            <input 
                              type="text" 
                              required 
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full bg-void border border-border-dim rounded-lg p-3 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-text-muted mb-1 uppercase">CVC Code</label>
                            <input 
                              type="text" 
                              required 
                              maxLength={3}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="w-full bg-void border border-border-dim rounded-lg p-3 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-950/10 border border-green-500/20 rounded-xl p-5 flex items-center gap-3 text-xs text-green-400 font-mono"
                      >
                        <DollarSign size={16} />
                        <span>You will pay the total amount of ${total.toFixed(2)} in cash when your package is delivered by courier agents.</span>
                      </motion.div>
                    )}

                    {/* Order Packaging bump */}
                    <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-xl p-5 relative overflow-hidden flex items-start gap-4">
                      <input 
                        type="checkbox" 
                        id="pack-bump"
                        checked={packagingOpt}
                        onChange={(e) => setPackagingOpt(e.target.checked)}
                        className="mt-1 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="pack-bump" className="font-bold text-white text-sm cursor-pointer flex items-center gap-2">
                          <span className="bg-accent-gold/15 text-accent-gold text-[9px] font-mono px-2 py-0.5 rounded border border-accent-gold/25 uppercase">SPECIAL</span>
                          ADD SIGNATURE PACKAGING
                        </label>
                        <p className="text-text-secondary text-xs mt-1">Make it a luxury experience. Includes signature matte box and custom handwritten notes. <span className="font-mono text-accent-gold">+$15.00</span></p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setStep("shipping")}
                        className="w-1/3 py-4 border border-border-dim rounded-lg text-xs font-mono uppercase text-text-secondary hover:text-white cursor-pointer"
                      >
                        BACK
                      </button>
                      <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-2/3 py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/5 flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg cursor-pointer"
                      >
                        {isProcessing ? (
                          <><Loader2 size={16} className="animate-spin" /> ESTABLISHING HANDSHAKE...</>
                        ) : (
                          <>PLACE ORDER - ${total.toFixed(2)}</>
                        )}
                      </button>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-[10px] font-mono text-text-muted mt-4">
                      <ShieldCheck size={12} className="text-accent-ice" />
                      <span>SECURED COMPLIANT HANDSHAKE SYSTEM ROUTING</span>
                    </div>

                  </form>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center py-6 space-y-4 flex flex-col items-center border-b border-border-dim/40 pb-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-400 mb-2">
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-3xl font-display font-extrabold text-white">ORDER PLACED SUCCESSFULLY</h2>
                    <p className="text-text-secondary text-sm max-w-md">
                      Thank you for your purchase. Your order has been registered in the database, and dispatch tracking details have been mapped.
                    </p>
                  </div>

                  {/* Foodpanda/Daraz Style Invoice Sheet */}
                  <div className="bg-obsidian border border-border-dim rounded-xl p-6 font-mono text-xs space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 bg-accent-gold/15 text-accent-gold px-4 py-1 text-[9px] uppercase tracking-widest font-bold border-b border-l border-border-dim">
                      {paymentMethod === "COD" ? "Cash on Delivery" : "Paid via Card"}
                    </div>

                    <div>
                      <span className="text-[10px] text-text-muted block uppercase tracking-widest">AURA LUXURY INVOICE</span>
                      <h3 className="text-sm font-bold text-white mt-1">ORDER ID: {orderNumber}</h3>
                      <span className="text-[9px] text-text-muted mt-0.5 block">PLACED ON: {new Date().toLocaleDateString()}</span>
                    </div>

                    {/* Delivery & Shipping Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-dim/40 pt-4">
                      <div>
                        <span className="text-[10px] text-text-muted block uppercase tracking-widest">SHIPPED TO</span>
                        <p className="text-white font-bold uppercase mt-1">{fullName}</p>
                        <p className="text-text-secondary mt-0.5">{addressLine1}</p>
                        <p className="text-text-secondary">{city}, Pakistan</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted block uppercase tracking-widest">CONTACT INFO</span>
                        <p className="text-text-secondary mt-1">Email: {email}</p>
                        <p className="text-text-secondary">Phone: {phone}</p>
                        <p className="text-text-secondary">Method: {shippingMethod === "express" ? "Express Priority" : "Standard Courier"}</p>
                      </div>
                    </div>

                    {/* Invoice Itemized List */}
                    <div className="border-t border-border-dim/40 pt-4">
                      <span className="text-[10px] text-text-muted block uppercase tracking-widest mb-3">ITEMS ORDERED</span>
                      <div className="space-y-3">
                        {placedItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded bg-void border border-border-dim" />
                              <div>
                                <span className="text-white font-bold block">{item.name}</span>
                                <span className="text-[9px] text-text-muted uppercase">QTY: {item.quantity} · Variant: {item.variant}</span>
                              </div>
                            </div>
                            <span className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing bill summary */}
                    <div className="border-t border-border-dim/40 pt-4 space-y-2">
                      <div className="flex justify-between text-text-secondary">
                        <span>CART SUBTOTAL</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>SHIPPING FEE</span>
                        <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                      </div>
                      {packagingOpt && (
                        <div className="flex justify-between text-text-secondary">
                          <span>SIGNATURE PACKAGING</span>
                          <span>$15.00</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-white border-t border-border-dim/30 pt-2">
                        <span>TOTAL BILL AMOUNT</span>
                        <span className="text-accent-gold font-mono">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Timeline milestone tracker */}
                  <div className="border border-border-dim bg-obsidian/40 rounded-xl p-6">
                    <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase block mb-4">DELIVERY ESTIMATE & TIMELINE</span>
                    <div className="flex justify-between relative px-2">
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-chrome z-0" />
                      <div className="absolute top-4 left-4 w-1/4 h-0.5 bg-accent-primary z-0" />
                      
                      {[
                        { title: "ORDER PLACED", active: true },
                        { title: "SORT FACILITY", active: true },
                        { title: "SHIPPED", active: false },
                        { title: "DELIVERED", active: false }
                      ].map((m, idx) => (
                        <div key={idx} className="flex flex-col items-center z-10 relative">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                            m.active ? "bg-accent-primary border-accent-primary text-white" : "bg-void border-chrome text-text-muted"
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-[8px] font-mono tracking-wider mt-2 text-text-secondary text-center uppercase leading-tight max-w-[60px]">{m.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => window.print()}
                      className="w-full sm:w-1/2 py-4 bg-chrome hover:bg-void border border-border-dim text-white font-bold rounded-lg uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Printer size={14} />
                      <span>Print Invoice</span>
                    </button>

                    <Link 
                      href="/dashboard?tab=orders" 
                      className="w-full sm:w-1/2 py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all text-center border border-white/5 hover:bg-opacity-95"
                    >
                      <span>TRACK IN DASHBOARD</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        {step !== "success" && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-obsidian border border-border-dim rounded-2xl p-6 glass-panel sticky top-28 shadow-2xl">
              <h3 className="font-display font-extrabold text-xl mb-6 border-b border-border-dim/40 pb-4 text-white uppercase tracking-tight">ORDER SUMMARY</h3>
              
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-border-dim/20 pb-4">
                    <div className="w-14 h-16 bg-chrome rounded-lg overflow-hidden flex-shrink-0 relative border border-border-dim">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-primary text-white rounded-full text-[9px] flex items-center justify-center font-mono font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                      <p className="text-[9px] font-mono text-text-muted uppercase mt-0.5">{item.variant}</p>
                      <p className="font-mono text-xs text-accent-gold mt-1">${item.price}</p>
                    </div>
                  </div>
                ))}
                
                {items.length === 0 && (
                  <p className="text-text-muted text-xs font-mono py-8 text-center">Checkout cart is empty.</p>
                )}
              </div>

              {/* Subtotal calculation */}
              <div className="space-y-3 text-xs font-mono border-t border-border-dim/40 pt-4 mt-6">
                <div className="flex justify-between text-text-secondary">
                  <span>SUBTOTAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>COURIER SHIPPING</span>
                  <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {packagingOpt && (
                  <div className="flex justify-between text-text-secondary">
                    <span>SIGNATURE PACKAGING</span>
                    <span>$15.00</span>
                  </div>
                )}
                
                <hr className="border-border-dim/40 my-2" />

                <div className="flex justify-between text-sm font-bold text-white">
                  <span>TOTAL BILLING</span>
                  <span className="text-accent-gold">${total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center text-xs font-mono text-text-muted">
        AURA PAYMENT HANDSHAKE CONNECTING...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
