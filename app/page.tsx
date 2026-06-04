"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { ShoppingBag, ArrowRight, Star, Award, Shield, Zap, Sparkles, Send, Check } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { useCartStore } from "@/stores/cartStore";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 3D Torus Component with Glassmorphism / Physical Material
function HeroProduct3D() {
  const meshRef = useRef<any>(null);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0.4, 0.2, 0.1]}>
      <torusKnotGeometry args={[1.2, 0.45, 200, 32]} />
      <meshPhysicalMaterial
        color="#6C63FF"
        transmission={0.6}
        opacity={1}
        roughness={0.15}
        metalness={0.8}
        ior={1.6}
        thickness={2.0}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

// Particles component using Canvas 2D
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    const count = 200;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Drift toward cursor subtly
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < 300) {
          p.x += dx * 0.001;
          p.y += dy * 0.001;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 216, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />;
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const logoMarkRef = useRef<HTMLDivElement | null>(null);
  const modelWrapperRef = useRef<HTMLDivElement | null>(null);
  const textGroupRef = useRef<HTMLDivElement | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  
  // Custom states
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [quickAddProduct, setQuickAddProduct] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success">("idle");
  const { addItem, openCart } = useCartStore();

  // Seeding local featured items for display
  const featuredItems = [
    { id: "var-1-1", name: "Aether Premium Parka", price: 495, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800", category: "Outerwear", desc: "Italian double-faced virgin wool blend." },
    { id: "var-2-1", name: "Nova Silk Blouse", price: 225, image: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800", category: "Tops", desc: "100% heavy crepe de chine mulberry silk." },
    { id: "var-3-1", name: "Zenith Loafer", price: 350, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800", category: "Footwear", desc: "Handcrafted calfskin leather loafers." },
    { id: "var-4-1", name: "Spectra Cardholder", price: 120, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800", category: "Accessories", desc: "Minimalist titanium RFID-blocking frame." }
  ];

  // AI recommendations
  const aiRecommendations = [
    { id: "var-5-1", name: "Apex Active Shell", price: 290, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800", tag: "Because you viewed Aether Parka" },
    { id: "var-6-1", name: "Zenith Cashmere Knit", price: 380, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", tag: "Trending in Karachi right now" },
    { id: "var-7-1", name: "Spectra Gold Signet", price: 620, image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800", tag: "Frequently bought together" },
    { id: "var-8-1", name: "Nova Tailored Pant", price: 260, image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800", tag: "AI Fit Suggestion - Match 98%" }
  ];

  // Quick Add handler
  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      variant: "M / Black",
    });
    setQuickAddProduct(null);
    openCart();
  };

  // Newsletter signup
  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    
    // Simulate Resend integration API post
    setTimeout(() => {
      setNewsletterStatus("success");
    }, 1500);
  };

  // Scroll Pinned Animation logic
  useEffect(() => {
    if (!containerRef.current) return;

    // Pinning the hero section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
      }
    });

    // Phase 1: Letter by letter title collapses into logo mark
    tl.to(introRef.current, {
      opacity: 0.1,
      scale: 0.8,
      duration: 0.8,
    });

    // Phase 2: 3D Product Canvas moves in & Text slides
    tl.to(modelWrapperRef.current, {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
    }, "-=0.4");

    tl.to(textGroupRef.current, {
      x: 0,
      opacity: 1,
      duration: 1,
    }, "-=1");

    // Phase 3: Zoom into product, materialise CTA
    tl.to(modelWrapperRef.current, {
      scale: 1.35,
      y: -50,
      duration: 1,
    });

    tl.to(heroCtaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, "-=0.5");

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-void min-h-screen relative text-text-primary overflow-x-hidden">
      {/* Particle Canvas */}
      <ParticleCanvas />

      {/* Pinned Hero Area */}
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden flex flex-col justify-center items-center z-10">
        
        {/* Background Ambient Video Layer Simulation */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void z-10" />
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-accent-primary)_0%,_transparent_60%)] filter blur-[120px]" />
        </div>

        {/* Phase 1: Logo Collapse Intro */}
        <div ref={introRef} className="absolute text-center z-10 select-none">
          <h1 className="text-[10vw] font-display font-extrabold tracking-tighter text-chromatic leading-none uppercase">
            AURA
          </h1>
          <p className="text-text-secondary text-sm font-mono tracking-[0.4em] uppercase mt-4">
            E-commerce engineered for the future
          </p>
        </div>

        {/* Phase 2 & 3 content container */}
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-2 items-center relative z-20 h-full pointer-events-none">
          
          {/* Left Hero Text Column */}
          <div 
            ref={textGroupRef} 
            className="flex flex-col space-y-6 opacity-0 translate-x-[-100px] pointer-events-auto"
          >
            <span className="text-accent-gold text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
              AURA 1.0 NOW DEPLOYED
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-extrabold leading-none tracking-tight">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-ice">Commerce.</span> <br />
              Engineered.
            </h2>
            <p className="text-text-secondary max-w-md text-sm md:text-base leading-relaxed">
              We build transactional art. Experience a platform with ultra-low latency, fluid animations, and real-time synchronisation.
            </p>
            
            {/* Phase 3 CTA */}
            <div ref={heroCtaRef} className="opacity-0 translate-y-20 pt-4">
              <Magnetic>
                <Link 
                  href="/shop" 
                  className="px-8 py-4 bg-accent-primary text-white font-bold rounded-lg flex items-center gap-3 shadow-lg shadow-accent-primary/20 hover:bg-opacity-90 transition-all border border-white/10"
                >
                  EXPLORE ARCHIVE <ArrowRight size={18} />
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Right Product 3D Column */}
          <div 
            ref={modelWrapperRef} 
            className="w-full h-[60vh] md:h-full opacity-0 translate-x-[150px] scale-[0.8] relative flex items-center justify-center pointer-events-auto"
          >
            {mounted && (
              <Suspense fallback={
                <div className="w-48 h-48 rounded-full border border-border-dim border-t-accent-primary animate-spin flex items-center justify-center">
                  <span className="text-xs font-mono text-text-muted">LOADING GEOMETRY</span>
                </div>
              }>
                <Canvas className="w-full h-full drop-shadow-[0_0_50px_rgba(108,99,255,0.2)]">
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} />
                  <pointLight position={[-10, -10, -5]} intensity={0.5} />
                  <HeroProduct3D />
                  <Environment preset="studio" />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* Marquee Bar Divider */}
      <section className="relative py-12 bg-obsidian border-y border-border-dim z-20 overflow-hidden flex flex-col gap-6">
        {/* Row 1: Left moving categories */}
        <div className="w-full flex overflow-hidden select-none">
          <div className="flex whitespace-nowrap animate-marquee-left hover:pause min-w-full text-2xl font-display font-bold uppercase tracking-wider text-text-muted">
            <span className="mx-8 text-white">OUTERWEAR ✦</span>
            <span className="mx-8">KNITWEAR ✦</span>
            <span className="mx-8 text-white">ACCESSORIES ✦</span>
            <span className="mx-8">FOOTWEAR ✦</span>
            <span className="mx-8 text-white">TAILORING ✦</span>
            <span className="mx-8">JEWELRY ✦</span>
            {/* Duplicate for infinite loop */}
            <span className="mx-8 text-white">OUTERWEAR ✦</span>
            <span className="mx-8">KNITWEAR ✦</span>
            <span className="mx-8 text-white">ACCESSORIES ✦</span>
            <span className="mx-8">FOOTWEAR ✦</span>
            <span className="mx-8 text-white">TAILORING ✦</span>
            <span className="mx-8">JEWELRY ✦</span>
          </div>
        </div>

        {/* Row 2: Right moving props */}
        <div className="w-full flex overflow-hidden select-none border-t border-border-dim/40 pt-4">
          <div className="flex whitespace-nowrap animate-marquee-right hover:pause min-w-full text-xs font-mono tracking-widest text-accent-gold uppercase">
            <span>FREE WORLDWIDE SHIPPING ✦ 30-DAY RETURNS ✦ AI-POWERED FIT ✦ CARBON NEUTRAL ✦ </span>
            <span>FREE WORLDWIDE SHIPPING ✦ 30-DAY RETURNS ✦ AI-POWERED FIT ✦ CARBON NEUTRAL ✦ </span>
          </div>
        </div>
      </section>

      {/* Featured Collection: Bento Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto z-20 relative">
        <div className="mb-20">
          <span className="text-accent-primary text-xs font-mono tracking-[0.25em] uppercase">CURATED COLLECTION</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold mt-3">FEATURED RELEASES</h2>
          <div className="h-[1px] bg-gradient-to-r from-accent-primary to-transparent w-48 mt-6" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large spanning 2 rows */}
          <div className="md:col-span-2 md:row-span-2 group bg-obsidian border border-border-dim rounded-2xl overflow-hidden relative flex flex-col justify-end p-8 h-[600px] glass-panel transition-all duration-500 hover:border-accent-primary/40 shadow-xl">
            <div className="absolute inset-0 overflow-hidden z-0 bg-void">
              <img 
                src={featuredItems[0].image} 
                alt={featuredItems[0].name}
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            </div>
            
            <div className="relative z-10 flex flex-col space-y-4">
              <span className="text-xs uppercase font-mono px-3 py-1 bg-white/10 w-max rounded-full tracking-wider border border-white/5">{featuredItems[0].category}</span>
              <h3 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">{featuredItems[0].name}</h3>
              <p className="text-text-secondary max-w-md text-sm">{featuredItems[0].desc}</p>
              <div className="flex justify-between items-center pt-4">
                <span className="font-mono text-2xl text-accent-gold">${featuredItems[0].price}</span>
                <button 
                  onClick={() => setQuickAddProduct(featuredItems[0])}
                  className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs rounded hover:bg-accent-ice transition-colors cursor-pointer"
                >
                  Quick Add
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          {featuredItems.slice(1).map((item, idx) => (
            <div 
              key={item.id}
              className="group bg-obsidian border border-border-dim rounded-2xl overflow-hidden relative flex flex-col justify-end p-6 h-[290px] glass-panel transition-all duration-500 hover:border-accent-primary/40 shadow-xl"
            >
              <div className="absolute inset-0 overflow-hidden z-0 bg-void">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
              </div>
              
              <div className="relative z-10 flex flex-col space-y-2">
                <h4 className="text-xl font-display font-bold tracking-tight">{item.name}</h4>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-sm text-accent-gold">${item.price}</span>
                  <button 
                    onClick={() => setQuickAddProduct(item)}
                    className="px-4 py-2 bg-chrome border border-border-dim text-text-primary text-[10px] font-mono tracking-widest uppercase hover:border-accent-primary transition-all cursor-pointer"
                  >
                    + ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Recommendations Strip */}
      <section className="py-24 bg-obsidian border-y border-border-dim relative z-20">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-accent-gold text-xs font-mono tracking-[0.25em] uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-accent-gold animate-bounce" /> AI ENGINE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold mt-3">CURATED FOR YOU BY AI</h2>
          </div>
          <p className="text-text-muted max-w-sm text-xs font-mono">
            Optimized recommendations compiled from browsing session cookies.
          </p>
        </div>

        {/* Snap Scrolling Row */}
        <div className="w-full overflow-x-auto flex gap-6 px-6 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar">
          <div className="flex-shrink-0 w-[5vw]" /> {/* Left spacer */}
          {aiRecommendations.map((prod) => (
            <div 
              key={prod.id} 
              className="flex-shrink-0 w-80 bg-void border border-border-dim rounded-xl p-4 snap-start hover:border-accent-primary/30 transition-all duration-300"
            >
              <div className="relative aspect-[4/5] bg-chrome rounded-lg overflow-hidden mb-4 group">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-3 left-3 bg-accent-primary/20 backdrop-blur-md text-accent-primary text-[10px] font-mono px-3 py-1 rounded-full border border-accent-primary/20">
                  {prod.tag}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-text-primary">{prod.name}</h3>
              <div className="flex justify-between items-center mt-3">
                <span className="font-mono text-sm text-accent-gold">${prod.price}</span>
                <button 
                  onClick={() => handleQuickAdd(prod)}
                  className="p-2 hover:bg-chrome rounded-lg text-accent-ice hover:text-white transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto z-20 relative grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="md:sticky md:top-32 h-max">
          <span className="text-text-muted text-xs font-mono tracking-[0.2em] uppercase">MANIFESTO</span>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mt-4 leading-none">
            WE DON'T SELL PRODUCTS. <br />
            WE SELL EXPERIENCES.
          </h2>
          <div className="w-24 h-[1px] bg-accent-primary/50 mt-8" />
        </div>

        <div className="flex flex-col space-y-12">
          <div className="bg-obsidian/40 border border-border-dim rounded-xl p-8 glass-panel">
            <Zap size={24} className="text-accent-primary mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Technical Superiority</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              We leverage cutting-edge edge compute networks, WebGL assets, and modern Next.js 15 routing parameters to render shopping catalogues in milliseconds. Zero drag.
            </p>
          </div>

          <div className="bg-obsidian/40 border border-border-dim rounded-xl p-8 glass-panel">
            <Award size={24} className="text-accent-gold mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Hyper-Curated Quality</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Every detail is meticulously planned. Hand-stitched garments, titanium RFID components, and tailored display frames ensure AURA matches your exact lifestyle specifications.
            </p>
          </div>

          <div className="bg-obsidian/40 border border-border-dim rounded-xl p-8 glass-panel">
            <Shield size={24} className="text-accent-ice mb-4" />
            <h3 className="text-xl font-display font-bold text-white mb-2">Sovereign Security</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Stripe checkout infrastructure guarantees absolute security. We support multi-currency routing, instant verification, and real-time fraud prevention.
            </p>
          </div>
        </div>
      </section>

      {/* Category Showcase: Custom Masonry Grid */}
      <section className="py-24 bg-obsidian border-y border-border-dim relative z-20">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <span className="text-accent-primary text-xs font-mono tracking-[0.25em] uppercase">COLLECTION SPLITS</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold mt-3">SHOP BY DISCIPLINE</h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "OUTERWEAR", count: 12, slug: "outerwear" },
            { name: "KNITWEAR", count: 8, slug: "knitwear" },
            { name: "TAILORING", count: 15, slug: "tailoring" },
            { name: "FOOTWEAR", count: 10, slug: "footwear" },
            { name: "ACCESSORIES", count: 5, slug: "accessories" },
          ].map((cat) => (
            <Link 
              key={cat.name} 
              href={`/shop?category=${cat.slug}`}
              className="group bg-void border border-border-dim rounded-xl p-6 flex flex-col justify-between h-48 transition-all duration-500 hover:bg-accent-primary relative overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-0 bg-accent-primary/20 group-hover:h-full transition-all duration-300 pointer-events-none" />
              <span className="font-mono text-xs text-text-muted group-hover:text-white/80 transition-colors">{cat.count} PRODUCTS</span>
              <h3 className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-black transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Proof Counter */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-center z-20 relative">
        <span className="text-accent-gold text-xs font-mono tracking-[0.2em] uppercase">GLOBAL DEMAND</span>
        <h2 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter text-white mt-4">
          12,847
        </h2>
        <p className="text-text-secondary text-sm font-mono tracking-[0.1em] uppercase mt-2">
          orders verified and shipped this month
        </p>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-gradient-to-b from-void to-obsidian border-t border-border-dim z-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--color-accent-primary)_0%,_transparent_50%)] opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-accent-ice text-xs font-mono tracking-[0.25em] uppercase">SUBSCRIBE</span>
          <h2 className="text-5xl md:text-7xl font-display font-extrabold mt-4 mb-6">JOIN AURA</h2>
          <p className="text-text-secondary text-sm md:text-base max-w-md mb-12">
            Register below to receive early archive releases, limited collection pre-sales, and technical updates.
          </p>

          <form onSubmit={handleNewsletter} className="w-full max-w-md flex flex-col sm:flex-row gap-3 relative">
            <input 
              type="email" 
              required
              placeholder="ENTER EMAIL ADDRESS" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-grow bg-chrome/50 border border-border-dim rounded-lg py-4 px-6 text-sm font-mono tracking-wide text-text-primary focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/25"
            />
            
            <button 
              type="submit" 
              disabled={newsletterStatus !== "idle"}
              className="px-6 py-4 bg-accent-primary hover:bg-opacity-95 text-white font-bold rounded-lg uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all min-w-[130px] border border-white/10"
            >
              {newsletterStatus === "idle" && (
                <>SIGN UP <Send size={14} /></>
              )}
              {newsletterStatus === "loading" && (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              )}
              {newsletterStatus === "success" && (
                <><Check size={16} className="text-white" /> DONE</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {quickAddProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-obsidian border border-border-dim rounded-2xl max-w-md w-full overflow-hidden p-6 relative z-10 glass-panel shadow-2xl"
            >
              <h3 className="text-2xl font-display font-extrabold mb-2">{quickAddProduct.name}</h3>
              <p className="text-accent-gold font-mono text-lg mb-6">${quickAddProduct.price}</p>
              
              <div className="aspect-[4/3] bg-chrome rounded-lg overflow-hidden mb-6">
                <img src={quickAddProduct.image} alt={quickAddProduct.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6 text-center text-xs font-mono">
                <div className="border border-border-dim p-2 rounded">COLOR: BLACK</div>
                <div className="border border-border-dim p-2 rounded">SIZE: M</div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setQuickAddProduct(null)}
                  className="flex-1 py-3 border border-border-dim rounded-lg text-text-secondary uppercase font-mono text-xs tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleQuickAdd(quickAddProduct)}
                  className="flex-1 py-3 bg-accent-primary text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-white/10"
                >
                  Confirm Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-void border-t border-border-dim py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-2xl font-display font-bold tracking-widest text-white">AURA</div>
            <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
              Designed and engineered by AURA. A flagship demonstration of dark luxury ecommerce architecture.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-text-muted uppercase tracking-[0.2em]">SHOP NAVIGATION</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/shop" className="hover:text-accent-primary transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=outerwear" className="hover:text-accent-primary transition-colors">Outerwear</Link></li>
              <li><Link href="/shop?category=knitwear" className="hover:text-accent-primary transition-colors">Knitwear</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-accent-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-text-muted uppercase tracking-[0.2em]">COMPANY</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/manifesto" className="hover:text-accent-primary transition-colors">Manifesto</Link></li>
              <li><Link href="/tech" className="hover:text-accent-primary transition-colors">Tech Specs</Link></li>
              <li><Link href="/privacy" className="hover:text-accent-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs text-text-muted uppercase tracking-[0.2em]">CREDIBILITY</h4>
            <div className="text-sm text-text-secondary leading-relaxed">
              Office # 203, Block-6, PECHS, Karachi, Pakistan.<br />
              Secure payments powered by Stripe Element checkout routing.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border-dim flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-muted font-mono">
            © {new Date().getFullYear()} AURA. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex gap-4">
            {/* Payment SVGs */}
            <span className="text-[10px] font-mono text-text-muted">STRIPE SECURED · SSL ENCRYPTED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
