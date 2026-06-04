"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  Package, Heart, Star, Bell, MapPin, ChevronRight, User as UserIcon, 
  Map, Award, Shield, Trash2, Edit3, Check, Loader2, Calendar, ShoppingCart, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";

// Mock location route for the map tracker
const TRACKING_STEPS = [
  { status: "ORDER PLACED", location: "AURA Fulfillment Centre, Karachi", date: "June 1, 2026", time: "09:00 AM", done: true },
  { status: "PROCESSING COMPLETED", location: "Sort Facility, DHA Phase 2, Karachi", date: "June 1, 2026", time: "06:15 PM", done: true },
  { status: "IN TRANSIT", location: "Courier Hub, Gulberg, Lahore", date: "June 2, 2026", time: "11:30 AM", done: true },
  { status: "OUT FOR DELIVERY", location: "Dispatch Terminal, Sector F-7, Islamabad", date: "June 3, 2026", time: "08:45 AM", done: true },
  { status: "DELIVERED", location: "Customer Residence, Islamabad", date: "June 3, 2026", time: "02:15 PM", done: false }
];

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const { addItem, openCart } = useCartStore();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "wishlist" | "profile">("overview");
  const [greeting, setGreeting] = useState("Good evening");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  // User Profile edits
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load user default inputs
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (session?.user) {
      setProfileName(session.user.name || "Alexander Raza");
      setProfileEmail(session.user.email || "customer@aura.com");
    } else {
      setProfileName("Alexander Raza");
      setProfileEmail("customer@aura.com");
    }
  }, [session]);

  // programmatically mock 5 user orders
  const orders = useMemo(() => {
    return [
      {
        id: "SYN-84920",
        date: "June 02, 2026",
        status: "PROCESSING",
        total: 495.00,
        carrier: "DHL Express",
        trackingNumber: "DHL-984029-PK",
        items: [
          { name: "Aether Essential Parka 1", variant: "Black / M", quantity: 1, price: 495, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=100" }
        ]
      },
      {
        id: "SYN-84918",
        date: "May 28, 2026",
        status: "DELIVERED",
        total: 575.00,
        carrier: "Leopards Courier",
        trackingNumber: "LEO-74291-KHI",
        items: [
          { name: "Nova Silk Blouse 2", variant: "Camel / S", quantity: 1, price: 225, image: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=100" },
          { name: "Zenith Loafer 3", variant: "Navy / 42", quantity: 1, price: 350, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=100" }
        ]
      },
      {
        id: "SYN-83210",
        date: "May 10, 2026",
        status: "DELIVERED",
        total: 120.00,
        carrier: "DHL Express",
        trackingNumber: "DHL-128491-PK",
        items: [
          { name: "Spectra Cardholder 4", variant: "Silver", quantity: 1, price: 120, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=100" }
        ]
      }
    ];
  }, []);

  // programmatically mock 3 wishlist items
  const [wishlistItems, setWishlistItems] = useState([
    { id: "var-2-1", name: "Nova Silk Blouse 2", price: 225, image: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=200", color: "Camel", size: "S" },
    { id: "var-3-1", name: "Zenith Loafer 3", price: 350, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=200", color: "Navy", size: "M" },
    { id: "var-4-1", name: "Spectra Cardholder 4", price: 120, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=200", color: "Silver", size: "O/S" }
  ]);

  const handleRemoveWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      variant: `${item.color} / ${item.size}`,
    });
    handleRemoveWishlist(item.id);
    openCart();
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setIsUpdatingProfile(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="bg-void min-h-screen pt-28 pb-20 text-text-primary">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dashboard Header banner */}
        <header className="mb-12 border-b border-border-dim pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="text-accent-primary text-xs font-mono tracking-[0.2em] uppercase">SECURE PORTAL</span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mt-3 text-white leading-tight">
              {greeting}, {profileName.split(" ")[0]}
            </h1>
            <p className="text-text-secondary text-sm mt-1">Manage orders, loyalty credits, and profile options.</p>
          </div>

          {/* Loyalty Program */}
          <div className="bg-obsidian border border-border-dim rounded-xl p-4 flex items-center gap-4 glass-panel shadow-lg">
            <div className="w-10 h-10 rounded-full bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center text-accent-gold">
              <Award size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-text-muted uppercase block">AURA LOYALTY</span>
              <span className="text-sm font-bold text-white font-mono">1,450 POINTS</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Menu (3 cols) */}
          <aside className="lg:col-span-3">
            <nav className="space-y-2 sticky top-28 font-mono text-xs tracking-wider">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === "overview" ? "border-accent-primary bg-accent-primary/10 text-white" : "border-border-dim text-text-secondary hover:border-text-secondary hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3"><Star size={16} /> OVERVIEW</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === "orders" ? "border-accent-primary bg-accent-primary/10 text-white" : "border-border-dim text-text-secondary hover:border-text-secondary hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3"><Package size={16} /> ORDERS & TIMELINE</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === "wishlist" ? "border-accent-primary bg-accent-primary/10 text-white" : "border-border-dim text-text-secondary hover:border-text-secondary hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3"><Heart size={16} /> WISHLIST</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  activeTab === "profile" ? "border-accent-primary bg-accent-primary/10 text-white" : "border-border-dim text-text-secondary hover:border-text-secondary hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3"><UserIcon size={16} /> PROFILE OPTIONS</span>
                <ChevronRight size={14} />
              </button>
            </nav>
          </aside>

          {/* Right Main Content Panel (9 cols) */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Statistics Counters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-obsidian border border-border-dim p-6 rounded-2xl glass-panel text-left">
                      <span className="text-[10px] font-mono text-text-muted uppercase">TOTAL COMPLETED ORDERS</span>
                      <h3 className="text-3xl font-display font-extrabold text-white mt-2">12</h3>
                    </div>
                    <div className="bg-obsidian border border-border-dim p-6 rounded-2xl glass-panel text-left">
                      <span className="text-[10px] font-mono text-text-muted uppercase">SAVED WISHLIST ITEMS</span>
                      <h3 className="text-3xl font-display font-extrabold text-white mt-2">{wishlistItems.length}</h3>
                    </div>
                    <div className="bg-obsidian border border-border-dim p-6 rounded-2xl glass-panel text-left">
                      <span className="text-[10px] font-mono text-text-muted uppercase">CASHBACK SAVINGS</span>
                      <h3 className="text-3xl font-display font-extrabold text-accent-gold mt-2">$145.00</h3>
                    </div>
                  </div>

                  {/* Active Shipment Tracker Panel */}
                  <div className="bg-obsidian border border-border-dim rounded-2xl p-6 glass-panel relative overflow-hidden flex flex-col gap-6 shadow-xl">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
                      <MapPin size={180} />
                    </div>
                    
                    <h3 className="text-sm font-mono tracking-widest text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse" />
                      ACTIVE SHIPMENT IN TRANSIT
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-mono text-text-muted block">DELIVERY CARRIER</span>
                          <span className="text-sm font-bold text-white">DHL EXPRESS (TRACKING: DHL-984029-PK)</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-text-muted block">EXPECTED DATE</span>
                          <span className="text-sm font-bold text-white">TOMORROW BY 12:00 PM</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab("orders")}
                          className="text-xs font-mono text-accent-ice hover:underline flex items-center gap-2"
                        >
                          VIEW TRACKING DETAILS <ArrowRight size={12} />
                        </button>
                      </div>

                      {/* Mock Route map graphic */}
                      <div className="h-44 bg-void border border-border-dim rounded-xl overflow-hidden relative flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600" 
                          alt="map routing simulation" 
                          className="w-full h-full object-cover opacity-25 grayscale"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_var(--color-void)_100%)]" />
                        <div className="absolute bottom-4 left-4 right-4 bg-chrome border border-border-dim p-2.5 rounded text-[10px] font-mono text-text-secondary flex justify-between items-center">
                          <span>LAST LOG: SORT FACILITY, ISLAMABAD</span>
                          <span className="text-accent-gold">08:45 AM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-display font-extrabold text-white mb-6 uppercase tracking-tight">ORDER HISTORY & STATUS</h3>
                  
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const isExpanded = selectedOrderDetails === order.id;
                      return (
                        <div 
                          key={order.id}
                          className="bg-obsidian border border-border-dim rounded-xl overflow-hidden glass-panel"
                        >
                          {/* Top Row toggle bar */}
                          <div 
                            onClick={() => setSelectedOrderDetails(isExpanded ? null : order.id)}
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-chrome/20 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <Package size={20} className="text-accent-primary" />
                              <div>
                                <span className="text-xs font-mono text-text-muted block">{order.date}</span>
                                <span className="text-sm font-bold text-white font-mono">{order.id}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 justify-between sm:justify-end">
                              <span className="font-mono text-sm text-accent-gold font-bold">${order.total.toFixed(2)}</span>
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono border ${
                                order.status === "DELIVERED" ? "border-green-500/20 bg-green-500/10 text-green-400" : "border-accent-primary/20 bg-accent-primary/10 text-accent-ice"
                              }`}>
                                {order.status}
                              </span>
                              <ChevronRight size={14} className={`text-text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                            </div>
                          </div>

                          {/* Expandable Order Detail and milestones */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden border-t border-border-dim/40 bg-void/50 p-6 space-y-6"
                              >
                                {/* Items list */}
                                <div className="space-y-3">
                                  <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase">ITEMS PURCHASED</span>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded bg-chrome border border-border-dim" />
                                      <div className="flex-grow text-xs">
                                        <h5 className="font-bold text-white">{item.name}</h5>
                                        <span className="text-[10px] text-text-muted uppercase font-mono">VARIANT: {item.variant} · QTY: {item.quantity}</span>
                                      </div>
                                      <span className="font-mono text-xs text-text-secondary">${item.price}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Tracking Milestones timeline */}
                                <div className="border-t border-border-dim/40 pt-6 space-y-4">
                                  <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase block">LIVE DELIVERY MILESTONES</span>
                                  <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-chrome">
                                    {TRACKING_STEPS.map((step, idx) => (
                                      <div key={idx} className="relative text-xs">
                                        <div className={`absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                                          step.done ? "bg-accent-primary border-accent-primary" : "bg-void border-chrome"
                                        }`} />
                                        <div>
                                          <span className={`font-bold block ${step.done ? "text-white" : "text-text-muted"}`}>{step.status}</span>
                                          <span className="text-[10px] text-text-secondary block mt-0.5">{step.location}</span>
                                          <span className="text-[9px] text-text-muted font-mono block mt-0.5">{step.date} · {step.time}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-display font-extrabold text-white mb-6 uppercase tracking-tight">SAVED WISHLIST</h3>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-obsidian border border-border-dim rounded-2xl glass-panel flex flex-col items-center justify-center space-y-4">
                      <Heart size={32} className="text-text-muted opacity-20" />
                      <p className="text-sm font-mono text-text-secondary">NO WISHLIST RELEASES SAVED.</p>
                      <Link href="/shop" className="px-5 py-2.5 bg-accent-primary text-white text-xs font-bold uppercase rounded tracking-wider">
                        Explore Catalog
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <AnimatePresence initial={false}>
                        {wishlistItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, height: 0 }}
                            className="bg-obsidian border border-border-dim rounded-xl p-4 glass-panel flex flex-col justify-between"
                          >
                            <div>
                              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-void mb-4 relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => handleRemoveWishlist(item.id)}
                                  className="absolute top-2 right-2 p-1.5 bg-void/85 rounded-full border border-border-dim text-text-muted hover:text-white transition-colors cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                              <span className="font-mono text-xs text-accent-gold mt-1 block">${item.price}</span>
                            </div>

                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="w-full py-2.5 mt-4 bg-chrome hover:bg-accent-primary border border-border-dim rounded-lg text-[10px] font-mono text-white tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <ShoppingCart size={12} />
                              <span>MOVE TO CART</span>
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-display font-extrabold text-white mb-6 uppercase tracking-tight">PROFILE SETTINGS</h3>

                  <div className="bg-obsidian border border-border-dim rounded-2xl p-6 sm:p-8 glass-panel shadow-2xl">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">FULL REGISTERED NAME</label>
                        <input 
                          type="text" 
                          required 
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">EMAIL ADDRESS</label>
                        <input 
                          type="email" 
                          required 
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                      </div>

                      {/* Change Password Placeholder */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">NEW PASSWORD</label>
                          <input 
                            type="password" 
                            placeholder="********"
                            className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-2">CONFIRM NEW PASSWORD</label>
                          <input 
                            type="password" 
                            placeholder="********"
                            className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border-dim/40 pt-6 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          className="text-xs font-mono text-red-500 hover:text-red-400 uppercase tracking-widest cursor-pointer"
                        >
                          DELETE REGISTERED ACCOUNT
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="px-8 py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/5 flex items-center justify-center gap-2 transition-all cursor-pointer min-w-[150px]"
                        >
                          {isUpdatingProfile ? (
                            <><Loader2 size={14} className="animate-spin" /> SAVING...</>
                          ) : updateSuccess ? (
                            <><Check size={14} /> UPDATED ✓</>
                          ) : (
                            "SAVE PROFILE CHANGES"
                          )}
                        </button>
                      </div>

                    </form>
                  </div>

                  {/* Mock Delete account confirmation overlay */}
                  <AnimatePresence>
                    {showDeleteModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          className="bg-obsidian border border-red-500/30 rounded-2xl w-full max-w-md p-6 glass-panel relative"
                        >
                          <h4 className="text-xl font-display font-extrabold text-white mb-2">DELETE ACCOUNT</h4>
                          <p className="text-text-secondary text-xs leading-relaxed mb-6">
                            This operation will permanently purge all transactions, loyalty point rewards, addresses, and account credentials from AURA databases. This cannot be undone.
                          </p>

                          <div className="flex gap-4">
                            <button
                              onClick={() => setShowDeleteModal(false)}
                              className="flex-1 py-3 border border-border-dim rounded-lg text-xs font-mono text-text-secondary uppercase"
                            >
                              CANCEL
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(false)}
                              className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg text-xs uppercase"
                            >
                              CONFIRM DELETE
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}
