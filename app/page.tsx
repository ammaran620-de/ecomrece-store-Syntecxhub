"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Scroll-hijacked intro sequence
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        },
      });

      tl.to(".intro-text-1", { opacity: 0, y: -50, duration: 1 })
        .fromTo(".intro-text-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
        .to(".intro-text-2", { opacity: 0, y: -50, duration: 1 }, "+=0.5")
        .fromTo(".intro-text-3", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 });
    }, introRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Custom Cursor Trail Container could go here */}

      {/* 1. Full-screen video hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {/* Replace with actual high-quality cinematic video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-on-a-rooftop-34394-large.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative z-20 text-center text-white flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="font-display text-7xl md:text-9xl font-bold tracking-tight mb-6"
          >
            AURA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-lg md:text-2xl font-light tracking-widest uppercase mb-10"
          >
            The New Standard of Luxury
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Link 
              href="/collections/new" 
              className="px-8 py-4 bg-white text-black font-medium tracking-wide hover:bg-black hover:text-white transition-colors duration-500 glass"
            >
              EXPLORE COLLECTION
            </Link>
          </motion.div>
        </div>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-10 right-10 z-30 p-4 rounded-full glass text-white hover:bg-white/20 transition-all"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </section>

      {/* 2. Scroll-hijacked intro sequence */}
      <section ref={introRef} className="h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
        <div className="text-center px-4 max-w-4xl mx-auto absolute">
          <h2 className="intro-text-1 font-display text-4xl md:text-7xl">
            We don't just create products.
          </h2>
        </div>
        <div className="text-center px-4 max-w-4xl mx-auto absolute">
          <h2 className="intro-text-2 font-display text-4xl md:text-7xl opacity-0">
            We craft experiences.
          </h2>
        </div>
        <div className="text-center px-4 max-w-4xl mx-auto absolute">
          <h2 className="intro-text-3 font-display text-4xl md:text-7xl opacity-0">
            Designed for the modern aesthete.
          </h2>
        </div>
      </section>

      {/* 3. Horizontal scroll marquee */}
      <div className="py-20 bg-primary text-primary-foreground overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex text-4xl md:text-6xl font-display uppercase tracking-wider space-x-16"
        >
          <span>Sustainable</span>
          <span>•</span>
          <span>Avant-Garde</span>
          <span>•</span>
          <span>Timeless</span>
          <span>•</span>
          <span>Minimalist</span>
          <span>•</span>
          <span>Sustainable</span>
          <span>•</span>
          <span>Avant-Garde</span>
          <span>•</span>
          <span>Timeless</span>
          <span>•</span>
          <span>Minimalist</span>
        </motion.div>
      </div>

      {/* 4. Bento-grid product feature */}
      <section className="py-24 px-4 md:px-10 max-w-screen-2xl mx-auto">
        <h3 className="font-display text-4xl md:text-6xl mb-12 text-center">Curated Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto gap-4 md:gap-6 auto-rows-[300px]">
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-muted rounded-lg">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" alt="Fashion 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-sm uppercase tracking-widest mb-2">New Arrival</p>
              <h4 className="text-3xl font-display">The Silk Collection</h4>
            </div>
          </div>
          <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-muted rounded-lg">
            <img src="https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800" alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-xl font-display">Accessories</h4>
            </div>
          </div>
          <div className="md:col-span-1 md:row-span-2 relative group overflow-hidden bg-muted rounded-lg">
             <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800" alt="Footwear" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-2xl font-display">Footwear</h4>
            </div>
          </div>
          <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-muted rounded-lg bg-black text-white flex items-center justify-center p-8 text-center hover:bg-zinc-900 transition-colors">
            <div>
              <h4 className="text-2xl font-display mb-4">View All</h4>
              <p className="text-sm text-zinc-400">Discover the full range of our meticulously crafted pieces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Parallax depth layers (simplified representation) */}
      <section className="h-[120vh] relative overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
         <motion.div 
           initial={{ y: 100, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
           className="absolute z-10 text-center pointer-events-none"
         >
           <h2 className="text-[15vw] font-display font-bold text-black/5 dark:text-white/5 whitespace-nowrap">ELEGANCE</h2>
         </motion.div>
         
         <motion.div
           initial={{ y: 200 }}
           whileInView={{ y: -50 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           viewport={{ once: true }}
           className="relative z-20 w-3/4 md:w-1/3"
         >
           <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800" alt="Shoes Parallax" className="w-full h-auto drop-shadow-2xl" />
         </motion.div>
      </section>
    </main>
  );
}
