"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronRight, Check, Sparkles, RefreshCw, ArrowRight, Camera, X, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Magnetic } from "@/components/ui/Magnetic";
import gsap from "gsap";

// 3D torus item showing in main area
function DetailProduct3D({ color }: { color: string }) {
  const meshRef = useRef<any>(null);

  const getColorHex = () => {
    switch (color.toLowerCase()) {
      case "camel": return "#C19A6B";
      case "navy": return "#000080";
      case "silver": return "#C0C0C0";
      case "ivory": return "#FFFFF0";
      default: return "#1A1A24";
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0.4, 0.4, 0]}>
      <torusKnotGeometry args={[1.3, 0.45, 256, 64]} />
      <meshPhysicalMaterial 
        color={getColorHex()} 
        transmission={0.8} 
        thickness={1.5} 
        roughness={0.1} 
        ior={1.5} 
        clearcoat={1} 
        metalness={0.3}
      />
    </mesh>
  );
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Local active configurations
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is3DView, setIs3DView] = useState(false);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  
  // Custom overlays
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [addedStatus, setAddedStatus] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { addItem, openCart } = useCartStore();
  const mainImageRef = useRef<HTMLImageElement | null>(null);
  const addToCartButtonRef = useRef<HTMLButtonElement | null>(null);

  // Generate catalog item details dynamically based on URL slug
  const product = {
    id: `prod-${params.slug}`,
    name: params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    price: 495,
    compareAtPrice: 620,
    category: "Outerwear",
    shortDescription: "A high-end, limited-edition essential designed and crafted by AURA using the finest double-faced Italian fabrics.",
    description: "Meticulously tailored from double-faced Italian virgin wool, this piece offers an unstructured silhouette that drapes elegantly. It features reinforced seam finishes and horn buttons. An unlined interior ensures lightweight warmth without extra bulk.",
    colors: ["Black", "Camel", "Navy", "Silver"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
      "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800"
    ]
  };

  // Flying Item GSAP Animation handler
  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent duplicate triggers
    if (addedStatus) return;

    // Trigger cart persistent additions
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      variant: `${selectedColor} / ${selectedSize}`,
    });

    setAddedStatus(true);
    
    // Flying Image Arc Animation using GSAP
    if (mainImageRef.current) {
      const imgRect = mainImageRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector(".lucide-shopping-bag");

      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();

        // Create a temporary overlay flying item
        const flyer = document.createElement("img");
        flyer.src = product.images[0];
        flyer.style.position = "fixed";
        flyer.style.left = `${imgRect.left}px`;
        flyer.style.top = `${imgRect.top}px`;
        flyer.style.width = `${imgRect.width}px`;
        flyer.style.height = `${imgRect.height}px`;
        flyer.style.zIndex = "9999";
        flyer.style.borderRadius = "12px";
        flyer.style.pointerEvents = "none";
        document.body.appendChild(flyer);

        // Animate with GSAP to the cart icon
        gsap.to(flyer, {
          left: cartRect.left,
          top: cartRect.top,
          width: 20,
          height: 25,
          opacity: 0.1,
          duration: 1.0,
          ease: "power2.inOut",
          onComplete: () => {
            document.body.removeChild(flyer);
            openCart();
            setTimeout(() => setAddedStatus(false), 2000);
          }
        });
      } else {
        openCart();
        setTimeout(() => setAddedStatus(false), 2000);
      }
    } else {
      openCart();
      setTimeout(() => setAddedStatus(false), 2000);
    }
  };

  // Sticky bottom Add to Cart Bar triggered on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-void min-h-screen text-text-primary pt-10">
      
      {/* Breadcrumb navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center text-xs font-mono tracking-widest text-text-muted space-x-2">
        <Link href="/shop" className="hover:text-white transition-colors">SHOP</Link>
        <ChevronRight size={10} />
        <span className="text-text-secondary uppercase">{product.category}</span>
        <ChevronRight size={10} />
        <span className="text-white uppercase">{product.name}</span>
      </nav>

      {/* Main product row config */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-6">
        
        {/* Left Column: Vertical Thumbnails (2 cols) */}
        <div className="lg:col-span-1 order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImageIndex(idx);
                setIs3DView(false);
              }}
              className={`w-16 h-20 bg-obsidian rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                activeImageIndex === idx && !is3DView ? "border-accent-primary scale-105" : "border-border-dim hover:border-text-secondary"
              }`}
            >
              <img src={img} alt="product thumb" className="w-full h-full object-cover" />
            </button>
          ))}
          
          {/* 3D Canvas Switcher Thumbnail Button */}
          <button
            onClick={() => setIs3DView(true)}
            className={`w-16 h-20 bg-chrome rounded-lg flex-shrink-0 border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              is3DView ? "border-accent-primary scale-105" : "border-border-dim hover:border-text-secondary"
            }`}
          >
            <RefreshCw size={18} className="text-accent-ice animate-spin-slow" />
            <span className="text-[9px] font-mono tracking-widest uppercase">3D VIEW</span>
          </button>
        </div>

        {/* Center: Main Preview Frame (5 cols) */}
        <div className="lg:col-span-6 order-1 lg:order-2 bg-obsidian border border-border-dim rounded-2xl overflow-hidden min-h-[450px] relative glass-panel flex items-center justify-center shadow-xl">
          {is3DView ? (
            <div className="w-full h-[500px] cursor-grab active:cursor-grabbing">
              <div className="absolute top-4 right-4 bg-void/85 border border-border-dim px-3 py-1 rounded-full text-[10px] font-mono text-accent-ice pointer-events-none z-10">
                ACTIVE 3D PREVIEW (ORBIT INPUTS)
              </div>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center text-xs font-mono text-text-muted">
                  COMPILING SHADERS...
                </div>
              }>
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1.5} />
                  <DetailProduct3D color={selectedColor} />
                  <Environment preset="studio" />
                  <OrbitControls enableZoom={true} />
                </Canvas>
              </Suspense>
            </div>
          ) : (
            <div className="w-full h-[500px] relative">
              <img
                ref={mainImageRef}
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Virtual Try-On AR Trigger Button */}
              <button 
                onClick={() => setCameraModalOpen(true)}
                className="absolute bottom-6 right-6 border border-border-dim bg-void/85 backdrop-blur-md px-5 py-3 rounded-lg text-xs font-mono tracking-widest text-white hover:border-accent-primary transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera size={14} className="text-accent-gold" />
                <span>TRY WITH AR (BETA)</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Product Info Details Column (5 cols) */}
        <div className="lg:col-span-5 order-3 space-y-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-accent-gold flex items-center gap-2">
              <Sparkles size={12} /> IN STOCK - SHIPS WITHIN 24H
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mt-3 leading-tight tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-1 text-accent-gold text-sm font-mono">
                <Star size={14} className="fill-current" />
                <span>4.8 (120 reviews)</span>
              </div>
              <span className="text-text-muted">|</span>
              <span className="text-text-secondary text-xs font-mono uppercase">{product.category}</span>
            </div>
          </div>

          {/* Pricing area */}
          <div className="flex items-baseline gap-4 border-y border-border-dim py-6">
            <span className="text-3xl font-mono text-white font-extrabold">${product.price}.00</span>
            <span className="text-sm font-mono text-text-muted line-through">${product.compareAtPrice}.00</span>
            <span className="bg-accent-gold/15 text-accent-gold text-[10px] font-mono px-2 py-0.5 rounded border border-accent-gold/20">
              SAVE 20%
            </span>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color swatches selector */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-text-muted uppercase">COLOR: {selectedColor.toUpperCase()}</h3>
            <div className="flex gap-4">
              {product.colors.map(col => {
                const isSelected = selectedColor === col;
                const getHex = () => {
                  if (col === "Camel") return "#C19A6B";
                  if (col === "Navy") return "#000080";
                  if (col === "Silver") return "#C0C0C0";
                  return "#000000";
                };
                return (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? "border-accent-primary scale-110" : "border-transparent"
                    }`}
                  >
                    <span 
                      className="w-7 h-7 rounded-full border border-white/10" 
                      style={{ backgroundColor: getHex() }}
                      title={col}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Pill Selectors */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-mono text-text-muted">
              <span>SIZE: {selectedSize}</span>
              <button className="underline hover:text-white transition-colors cursor-pointer">SIZE GUIDE</button>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center font-mono">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSize === size 
                      ? "border-accent-primary bg-accent-primary/10 text-white" 
                      : "border-border-dim hover:border-text-secondary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper & CTA button */}
          <div className="flex gap-4 pt-4">
            <div className="flex items-center border border-border-dim rounded-lg bg-obsidian">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-4 py-3 hover:bg-chrome rounded-l-lg transition-colors text-text-muted hover:text-white"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 font-mono text-sm text-white font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-4 py-3 hover:bg-chrome rounded-r-lg transition-colors text-text-muted hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              ref={addToCartButtonRef}
              onClick={handleAddToCart}
              className="flex-grow py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/10 flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg shadow-accent-primary/10 cursor-pointer"
            >
              {addedStatus ? (
                <><Check size={16} /> ADDED ✓</>
              ) : (
                <>ADD TO ARCHIVE <ArrowRight size={14} /></>
              )}
            </button>
          </div>

          {/* Accordion Specification sections */}
          <div className="border-t border-border-dim pt-6 space-y-4">
            {/* Specs Accordion */}
            <div className="border-b border-border-dim pb-4">
              <button 
                onClick={() => setActiveTab(activeTab === "specs" ? "" : "specs")}
                className="w-full flex justify-between items-center text-xs font-mono tracking-widest text-white uppercase cursor-pointer"
              >
                <span>Description & Materials</span>
                <span>{activeTab === "specs" ? "-" : "+"}</span>
              </button>
              <AnimatePresence>
                {activeTab === "specs" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 text-xs text-text-secondary leading-relaxed space-y-2"
                  >
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2">
                      <li>100% Italian Double-Faced Virgin Wool</li>
                      <li>Water-repellent structured fiber weave</li>
                      <li>Horn button details</li>
                      <li>Dry Clean Only</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping Accordion */}
            <div className="border-b border-border-dim pb-4">
              <button 
                onClick={() => setActiveTab(activeTab === "shipping" ? "" : "shipping")}
                className="w-full flex justify-between items-center text-xs font-mono tracking-widest text-white uppercase cursor-pointer"
              >
                <span>Shipping & Returns</span>
                <span>{activeTab === "shipping" ? "-" : "+"}</span>
              </button>
              <AnimatePresence>
                {activeTab === "shipping" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 text-xs text-text-secondary leading-relaxed"
                  >
                    We offer free worldwide courier express shipping on orders over $300. Orders ship within 24 hours and are delivered in 3-5 business days. 30-day premium return policy enabled.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 bg-obsidian border-t border-border-dim p-4 z-40 backdrop-blur-xl flex justify-between items-center max-w-4xl mx-auto rounded-t-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <img src={product.images[0]} alt={product.name} className="w-10 h-12 object-cover rounded bg-void" />
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">{product.name}</h4>
                <span className="font-mono text-xs text-accent-gold">${product.price}</span>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-mono text-text-muted hidden sm:inline">{selectedColor} / {selectedSize}</span>
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-accent-primary text-white text-[10px] font-mono font-bold tracking-widest uppercase rounded-lg hover:bg-opacity-95 border border-white/5 transition-all cursor-pointer"
              >
                {addedStatus ? "ADDED ✓" : "QUICK ADD"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Try-On AR Mock Camera Modal */}
      <AnimatePresence>
        {cameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCameraModalOpen(false)}
              className="absolute inset-0 bg-black/90"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-obsidian border border-border-dim rounded-2xl w-full max-w-xl overflow-hidden glass-panel shadow-2xl relative z-10 p-6 flex flex-col h-[550px] justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border-dim pb-4">
                <div className="flex items-center gap-2 text-accent-gold text-xs font-mono uppercase">
                  <Camera size={14} />
                  <span>AURA AR TRY-ON FRAME</span>
                </div>
                <button 
                  onClick={() => setCameraModalOpen(false)}
                  className="p-1 hover:bg-chrome rounded text-text-muted hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mock camera view */}
              <div className="flex-grow bg-void border border-border-dim rounded-xl my-4 relative overflow-hidden flex items-center justify-center">
                {/* Camera simulation overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)] z-10" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-white animate-pulse">
                  <span>REC</span>
                </div>
                
                {/* Visual simulator outline */}
                <div className="border-2 border-dashed border-accent-primary/40 rounded-full w-48 h-64 flex items-center justify-center z-10 relative">
                  <span className="text-[10px] font-mono text-accent-primary/60 absolute bottom-6">ALIGN TORSO AREA</span>
                </div>

                <div className="absolute inset-0 z-0 bg-chrome flex items-center justify-center">
                  <p className="text-xs font-mono text-text-muted text-center max-w-xs">
                    CAMERA ACCESS REQUEST COMPLETED.<br />
                    MOCK SCREEN SCANNING IN PROGRESS...
                  </p>
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => setCameraModalOpen(false)}
                className="w-full py-4 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/5"
              >
                CAPTURE ARCHIVE SNAPSHOT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
