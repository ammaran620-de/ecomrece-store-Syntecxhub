"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  DollarSign, ShoppingCart, Users, Activity, ArrowUpRight, ArrowDownRight, 
  Plus, Edit, Eye, Trash2, Calendar, FileText, CheckCircle2, ShieldCheck, 
  Image as ImageIcon, Loader2, Sparkles, Tag, ChevronDown, Check, Globe 
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  // State managers
  const [mounted, setMounted] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Live order list stream
  const [liveOrders, setLiveOrders] = useState([
    { id: "ord-9844", customer: " Sibtain Raza", price: 495, time: "Just now", status: "PROCESSING" },
    { id: "ord-9843", customer: " Sibtain Raza", price: 225, time: "2 min ago", status: "DELIVERED" },
    { id: "ord-9842", customer: " Sibtain Raza", price: 350, time: "10 min ago", status: "DELIVERED" },
    { id: "ord-9841", customer: " Sibtain Raza", price: 120, time: "25 min ago", status: "DELIVERED" }
  ]);

  // Product table inventory state
  const [products, setProducts] = useState([
    { id: "prod-1", name: "Aether Essential Parka 1", category: "Outerwear", brand: "Aether", price: 495, stock: 12, published: true },
    { id: "prod-2", name: "Nova Silk Blouse 2", category: "Tops", brand: "Nova", price: 225, stock: 24, published: true },
    { id: "prod-3", name: "Zenith Loafer 3", category: "Footwear", brand: "Zenith", price: 350, stock: 8, published: true },
    { id: "prod-4", name: "Spectra Cardholder 4", category: "Accessories", brand: "Spectra", price: 120, stock: 30, published: true },
    { id: "prod-5", name: "Apex Active Shell 5", category: "Activewear", brand: "Apex", price: 290, stock: 4, published: false }
  ]);

  // Order List database manager
  const [orders, setOrders] = useState([
    { id: "SYN-84920", customer: "Sibtain Raza", date: "June 02, 2026", status: "PROCESSING", total: 495.00 },
    { id: "SYN-84918", customer: "Sibtain Raza", date: "May 28, 2026", status: "DELIVERED", total: 575.00 },
    { id: "SYN-83210", customer: "Sibtain Raza", date: "May 10, 2026", status: "DELIVERED", total: 120.00 }
  ]);

  // Create Product Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Outerwear");
  const [newProductBrand, setNewProductBrand] = useState("Aether");
  const [newProductPrice, setNewProductPrice] = useState("350");
  const [newProductStock, setNewProductStock] = useState("10");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Auto-stream fake orders when live
  useEffect(() => {
    setMounted(true);
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      const orderId = `ord-${Math.floor(9800 + Math.random() * 40)}`;
      const price = Math.floor(80 + Math.random() * 500);
      const newOrder = {
        id: orderId,
        customer: "Customer " + Math.floor(Math.random() * 50 + 1),
        price,
        time: "Just now",
        status: "PROCESSING"
      };

      setLiveOrders(prev => [newOrder, ...prev.slice(0, 4)]);
      // Update overall orders too
      setOrders(prev => [
        { id: `SYN-${Math.floor(80000 + Math.random() * 9000)}`, customer: newOrder.customer, date: "Today", status: "PROCESSING", total: price },
        ...prev
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  // Handle product wizard submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProduct(true);

    setTimeout(() => {
      const newProd = {
        id: `prod-${products.length + 1}`,
        name: newProductName || "Bespoke Collection release",
        category: newProductCategory,
        brand: newProductBrand,
        price: Number(newProductPrice),
        stock: Number(newProductStock),
        published: true
      };

      setProducts(prev => [newProd, ...prev]);
      setIsCreatingProduct(false);
      setWizardOpen(false);
      setWizardStep(1);
      // Reset inputs
      setNewProductName("");
      setNewProductDesc("");
      setNewProductImage("");
    }, 1500);
  };

  const togglePublish = (id: string) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, published: !p.published } : p)
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(prev => 
      prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 text-text-primary">
      
      {activeTab === "overview" && (
        <motion.div
          key="overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          {/* KPI Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "SYSTEM REVENUE", value: "$124,563.00", change: "+14.5%", isPositive: true, icon: DollarSign, color: "var(--color-accent-primary)" },
              { title: "TRANSACTIONS", value: "842", change: "+5.2%", isPositive: true, icon: ShoppingCart, color: "var(--color-accent-gold)" },
              { title: "USER ACCOUNTS", value: "3,214", change: "-1.1%", isPositive: false, icon: Users, color: "var(--color-accent-ice)" },
              { title: "CONVERSION RATIO", value: "3.4%", change: "+0.8%", isPositive: true, icon: Activity, color: "var(--color-text-primary)" }
            ].map((kpi, idx) => (
              <div 
                key={idx}
                className="bg-obsidian border border-border-dim rounded-2xl p-6 glass-panel relative overflow-hidden flex flex-col justify-between h-40 shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{kpi.title}</span>
                    <h3 className="text-3xl font-display font-extrabold text-white mt-2 font-mono">{kpi.value}</h3>
                  </div>
                  <div className="p-3 bg-chrome rounded-xl text-white" style={{ borderColor: kpi.color, borderWidth: 1 }}>
                    <kpi.icon size={18} />
                  </div>
                </div>

                <div className="flex items-center text-xs font-mono">
                  <span className={`flex items-center font-bold ${kpi.isPositive ? "text-green-400" : "text-red-400"}`}>
                    {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {kpi.change}
                  </span>
                  <span className="text-text-muted ml-2">VS PREVIOUS CYCLE</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart and Live Orders Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Custom SVG Revenue Area Graph */}
            <div className="lg:col-span-2 bg-obsidian border border-border-dim rounded-2xl p-6 glass-panel min-h-[400px] flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">REVENUE RATIO OVERVIEW</h3>
                  <p className="text-[10px] font-mono text-text-muted mt-1">REAL-TIME MULTI-CURRENCY CONVERSION GRAPH</p>
                </div>
                <select className="bg-chrome border border-border-dim text-xs font-mono text-white rounded-lg px-4 py-2 focus:outline-none">
                  <option>LAST 15 DAYS</option>
                  <option>THIS YEAR</option>
                </select>
              </div>

              {/* High fidelity inline SVG area chart */}
              <div className="flex-grow w-full relative h-64 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  {/* Gradient fill pathway */}
                  <path 
                    d="M0,200 L0,150 L50,130 L100,160 L150,110 L200,90 L250,140 L300,100 L350,80 L400,110 L450,70 L500,40 L500,200 Z" 
                    fill="url(#chartGradient)" 
                  />

                  {/* Line pathway */}
                  <path 
                    d="M0,150 L50,130 L100,160 L150,110 L200,90 L250,140 L300,100 L350,80 L400,110 L450,70 L500,40" 
                    fill="none" 
                    stroke="var(--color-accent-primary)" 
                    strokeWidth="2" 
                  />

                  {/* Highlight dots */}
                  <circle cx="200" cy="90" r="4" fill="var(--color-accent-ice)" />
                  <circle cx="500" cy="40" r="4" fill="var(--color-accent-gold)" />
                </svg>
                
                {/* Custom tooltip overlay */}
                <div className="absolute top-10 left-[180px] bg-chrome border border-border-dim p-2 rounded text-[9px] font-mono shadow-xl pointer-events-none">
                  <span className="text-accent-gold font-bold block">SYS PEAK: $8,420</span>
                  <span className="text-text-muted">MAY 25</span>
                </div>
              </div>

              {/* Labels */}
              <div className="flex justify-between font-mono text-[9px] text-text-muted mt-4 border-t border-border-dim/40 pt-4">
                <span>MAY 15</span>
                <span>MAY 20</span>
                <span>MAY 25</span>
                <span>MAY 30</span>
                <span>TODAY</span>
              </div>
            </div>

            {/* Real-time Order Stream Feed */}
            <div className="bg-obsidian border border-border-dim rounded-2xl p-6 glass-panel flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">LIVE ORDER FEED</h3>
                  <p className="text-[10px] font-mono text-text-muted mt-1">POLLING LIVE SECURE ENDPOINTS</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-mono text-green-400">ACTIVE</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[320px] no-scrollbar">
                <AnimatePresence initial={false}>
                  {liveOrders.map((order, idx) => (
                    <motion.div 
                      key={order.id + idx}
                      initial={{ opacity: 0, y: -20, backgroundColor: "rgba(108,99,255,0.15)" }}
                      animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                      transition={{ duration: 0.8 }}
                      className="flex items-center justify-between p-3.5 border border-border-dim/40 rounded-xl bg-void/35 hover:border-accent-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-chrome border border-border-dim flex items-center justify-center text-text-secondary font-mono text-xs font-bold">
                          #{order.id.split("-")[1]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase">{order.customer}</p>
                          <span className="text-[9px] font-mono text-text-muted">{order.time}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-accent-gold font-bold">${order.price}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {activeTab === "orders" && (
        <motion.div
          key="orders"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">ORDER ENTRIES</h3>
              <p className="text-xs font-mono text-text-muted mt-1">DISPATCH AND STATUS FULFILLMENT SYSTEMS</p>
            </div>
          </div>

          <div className="bg-obsidian border border-border-dim rounded-2xl glass-panel overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-void/50 text-text-muted uppercase border-b border-border-dim">
                  <tr>
                    <th className="p-4">ORDER ID</th>
                    <th className="p-4">CUSTOMER</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4">TOTAL</th>
                    <th className="p-4">STATUS CODE</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dim/35">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-chrome/20 transition-colors">
                      <td className="p-4 text-white font-bold">{o.id}</td>
                      <td className="p-4 uppercase text-text-secondary">{o.customer}</td>
                      <td className="p-4 text-text-secondary">{o.date}</td>
                      <td className="p-4 text-accent-gold font-bold">${o.total}</td>
                      <td className="p-4">
                        <select 
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="bg-chrome border border-border-dim rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:border-accent-primary"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-accent-ice hover:underline cursor-pointer">DISPATCH</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "products" && (
        <motion.div
          key="products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-white">CATALOGUE INVENTORY</h3>
              <p className="text-xs font-mono text-text-muted mt-1">MANAGE PRODUCTS AND SYSTEM ATTRIBUTES</p>
            </div>
            
            <button 
              onClick={() => setWizardOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-accent-primary text-white font-mono text-xs font-bold rounded-lg uppercase tracking-wider border border-white/5 cursor-pointer hover:bg-opacity-95 shadow-lg"
            >
              <Plus size={14} />
              <span>NEW RELEASE</span>
            </button>
          </div>

          <div className="bg-obsidian border border-border-dim rounded-2xl glass-panel overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-void/50 text-text-muted uppercase border-b border-border-dim">
                  <tr>
                    <th className="p-4">PRODUCT DETAILS</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">PRICE</th>
                    <th className="p-4">STOCK</th>
                    <th className="p-4">STATE</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dim/35">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-chrome/20 transition-colors">
                      <td className="p-4">
                        <span className="text-white font-bold block">{p.name}</span>
                        <span className="text-[10px] text-text-muted uppercase mt-0.5">{p.brand}</span>
                      </td>
                      <td className="p-4 text-text-secondary uppercase">{p.category}</td>
                      <td className="p-4 text-accent-gold font-bold">${p.price}</td>
                      <td className="p-4 text-text-secondary">{p.stock} units</td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublish(p.id)}
                          className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                            p.published ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                          }`}
                        >
                          {p.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="p-4 text-right flex gap-3 justify-end items-center">
                        <button 
                          onClick={() => deleteProduct(p.id)}
                          className="text-text-muted hover:text-red-500 p-1"
                          title="Purge"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dynamic Creation Product Wizard modal */}
      <AnimatePresence>
        {wizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWizardOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-obsidian border border-border-dim rounded-2xl w-full max-w-xl overflow-hidden glass-panel shadow-2xl z-10 p-6 flex flex-col relative"
            >
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border-dim/40 pb-4 mb-6">
                <div>
                  <h4 className="text-lg font-display font-extrabold text-white uppercase flex items-center gap-2">
                    <Sparkles size={16} className="text-accent-primary" />
                    <span>CREATE NEW RELEASE</span>
                  </h4>
                  <p className="text-[9px] font-mono text-text-muted uppercase">Step {wizardStep} of 4</p>
                </div>
                <button 
                  onClick={() => setWizardOpen(false)}
                  className="p-1 hover:bg-chrome rounded text-text-muted"
                >
                  <ChevronDown size={20} className="rotate-90" />
                </button>
              </div>

              {/* Step Forms */}
              <form onSubmit={handleCreateProduct} className="space-y-6">
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-mono tracking-widest text-white uppercase">Step 1: Product Specifications</h5>
                    <div>
                      <label className="block text-[9px] font-mono text-text-muted mb-2">PRODUCT NAME</label>
                      <input 
                        type="text" 
                        required 
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="Aether Essential Blazer"
                        className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none focus:border-accent-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono text-text-muted mb-2">CATEGORY</label>
                        <select
                          value={newProductCategory}
                          onChange={(e) => setNewProductCategory(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                        >
                          <option>Outerwear</option>
                          <option>Knitwear</option>
                          <option>Tops</option>
                          <option>Accessories</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-text-muted mb-2">BRAND</label>
                        <select
                          value={newProductBrand}
                          onChange={(e) => setNewProductBrand(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                        >
                          <option>Aether</option>
                          <option>Spectra</option>
                          <option>Nova</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-mono tracking-widest text-white uppercase">Step 2: Media Asset Mapping</h5>
                    
                    {/* Simulated Drag & Drop */}
                    <div className="border border-dashed border-border-dim hover:border-accent-primary rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer bg-void/25 transition-all">
                      <ImageIcon size={32} className="text-text-muted opacity-40 animate-pulse" />
                      <div>
                        <span className="text-xs font-mono text-white block">DRAG FILES HERE OR CLICK TO UPLOAD</span>
                        <span className="text-[10px] font-mono text-text-muted block mt-1">Cloudinary CDN direct sync mapping (Max 5MB)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-text-muted mb-2">IMAGE SOURCE URL (MOCK CONFIGURED)</label>
                      <input 
                        type="text"
                        value={newProductImage}
                        onChange={(e) => setNewProductImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-mono tracking-widest text-white uppercase">Step 3: Variant inventory & pricing</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono text-text-muted mb-2">BASE PRICE ($)</label>
                        <input 
                          type="number" 
                          required 
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-text-muted mb-2">INITIAL STOCK UNITS</label>
                        <input 
                          type="number" 
                          required 
                          value={newProductStock}
                          onChange={(e) => setNewProductStock(e.target.value)}
                          className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="border border-border-dim p-4 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-text-muted uppercase block">CONFIGURED VARIANTS SCHEMA</span>
                      <div className="flex gap-2 text-[10px] font-mono">
                        <span className="bg-chrome px-2 py-1 rounded">BLACK / M</span>
                        <span className="bg-chrome px-2 py-1 rounded">NAVY / S</span>
                        <span className="bg-chrome px-2 py-1 rounded">CAMEL / L</span>
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 4 && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-mono tracking-widest text-white uppercase">Step 4: SEO Metadata Optimization</h5>
                    
                    <div>
                      <label className="block text-[9px] font-mono text-text-muted mb-2">META TITLE EXTRAS</label>
                      <input 
                        type="text"
                        placeholder="AURA | Bespoke release"
                        className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-text-muted mb-2">META DESCRIPTION</label>
                      <textarea 
                        rows={2}
                        placeholder="Explore the limited edition release..."
                        className="w-full bg-chrome/50 border border-border-dim rounded-lg p-4 text-xs font-mono text-white focus:outline-none"
                      />
                    </div>

                    {/* OG preview mockup */}
                    <div className="bg-void/40 border border-border-dim p-4 rounded-xl flex gap-3 items-center">
                      <Globe size={24} className="text-accent-ice" />
                      <div>
                        <span className="text-[10px] font-mono text-white block">SEARCH INDEX PREVIEW</span>
                        <p className="text-[9px] text-text-muted leading-tight mt-1">https://aura.co/shop/slug<br />Secure search listing index generated dynamically.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation and submit block */}
                <div className="flex justify-between items-center border-t border-border-dim/40 pt-6 mt-6">
                  <button
                    type="button"
                    disabled={wizardStep === 1}
                    onClick={() => setWizardStep(prev => prev - 1)}
                    className="px-4 py-2 border border-border-dim rounded text-xs font-mono text-text-secondary disabled:opacity-30 cursor-pointer"
                  >
                    PREVIOUS
                  </button>

                  {wizardStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(prev => prev + 1)}
                      className="px-5 py-2.5 bg-chrome hover:bg-void border border-border-dim rounded-lg text-xs font-mono text-white cursor-pointer"
                    >
                      NEXT
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isCreatingProduct}
                      className="px-6 py-2.5 bg-accent-primary hover:bg-opacity-95 text-white font-bold rounded-lg text-xs uppercase flex items-center justify-center gap-2 border border-white/5 cursor-pointer"
                    >
                      {isCreatingProduct ? (
                        <><Loader2 size={12} className="animate-spin" /> CREATING...</>
                      ) : (
                        "CONFIRM RELEASE"
                      )}
                    </button>
                  )}
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-void flex items-center justify-center text-xs font-mono text-text-muted">
        AURA CORE CONNECTING...
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
