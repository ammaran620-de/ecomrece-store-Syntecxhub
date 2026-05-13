"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Header } from "@/components/store/Header";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// The stunning 3D Hero Object
function HeroBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial 
          color="#ffffff"
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Advanced GSAP Horizontal Scroll & Parallax
    const ctx = gsap.context(() => {
      // Horizontal Scroll for Curated Selection
      if (horizontalRef.current && horizontalContainerRef.current) {
        const sections = gsap.utils.toArray(".horizontal-panel");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalContainerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + horizontalRef.current!.offsetWidth,
          }
        });
      }

      // Parallax Images in About
      gsap.utils.toArray(".parallax-img").forEach((img: any) => {
        gsap.to(img, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            scrub: true,
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null; // Avoid hydration mismatch for Canvas

  return (
    <main ref={containerRef} className="relative bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden">
      <Header />
      
      {/* HERO SECTION WITH 3D WEBGL */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
            <HeroBlob />
            <Environment preset="city" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          </Canvas>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 w-full px-4 flex flex-col items-center pointer-events-none mix-blend-difference text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] leading-none font-display uppercase tracking-tighter text-center"
          >
            A<span className="font-sans italic font-light pr-[2vw]">U</span>RA
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 pointer-events-auto mix-blend-normal text-zinc-900 dark:text-white"
          >
            <Link href="/shop" className="group flex items-center gap-4 text-sm tracking-widest uppercase bg-foreground text-background px-8 py-4 rounded-full hover:scale-105 transition-transform duration-500">
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MASSIVE STATEMENT SECTION */}
      <section className="py-32 px-4 md:px-10 max-w-screen-2xl mx-auto flex items-center min-h-[80vh]">
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-display leading-[1.1] max-w-5xl">
          We strip away the <span className="italic text-zinc-400">superfluous</span> to reveal the absolute essence of modern luxury.
        </h2>
      </section>

      {/* OVERLAPPING PARALLAX IMAGES (Magazine Style) */}
      <section className="py-32 px-4 md:px-10 max-w-screen-2xl mx-auto relative min-h-[150vh] hidden md:block">
        <div className="sticky top-40 z-10 w-full md:w-1/2">
          <h3 className="text-sm tracking-widest uppercase mb-6">Our Ethos</h3>
          <p className="text-2xl md:text-4xl font-display leading-snug">
            Every thread, every seam, every silhouette is considered. We don't chase trends. We architect timelessness.
          </p>
          <Link href="/about" className="inline-block mt-12 border-b border-foreground pb-1 text-sm tracking-widest uppercase hover:text-muted-foreground transition-colors">
            Discover Our Story
          </Link>
        </div>
        
        <div className="absolute right-10 top-0 w-3/4 md:w-1/3 aspect-[3/4] overflow-hidden -z-0">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000" className="parallax-img w-full h-[130%] object-cover -translate-y-[15%]" alt="Fashion" />
        </div>
        <div className="absolute left-10 md:left-[40%] top-[60vh] w-2/3 md:w-1/4 aspect-square overflow-hidden z-20">
          <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800" className="parallax-img w-full h-[130%] object-cover -translate-y-[15%]" alt="Details" />
        </div>
      </section>

      {/* HORIZONTAL SCROLL GALLERY */}
      <section ref={horizontalContainerRef} className="h-screen w-full bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-10 left-10 z-10">
          <h3 className="text-sm tracking-widest uppercase">Curated Archives</h3>
        </div>
        <div ref={horizontalRef} className="flex h-full w-[400vw]">
          {/* Panel 1 */}
          <div className="horizontal-panel w-screen h-full flex flex-col md:flex-row items-center justify-center p-10 gap-10">
             <div className="w-full md:w-1/3 aspect-[4/5] overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </div>
             <div className="w-full md:w-1/3">
               <h4 className="text-5xl font-display mb-4">01. The Silk Collection</h4>
               <p className="text-zinc-400">Fluidity meets structure.</p>
             </div>
          </div>
          {/* Panel 2 */}
          <div className="horizontal-panel w-screen h-full flex flex-col md:flex-row items-center justify-center p-10 gap-10">
             <div className="w-full md:w-1/3 aspect-[4/5] overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </div>
             <div className="w-full md:w-1/3">
               <h4 className="text-5xl font-display mb-4">02. Essential Accessories</h4>
               <p className="text-zinc-400">Crafted to endure lifetimes.</p>
             </div>
          </div>
          {/* Panel 3 */}
          <div className="horizontal-panel w-screen h-full flex flex-col md:flex-row items-center justify-center p-10 gap-10">
             <div className="w-full md:w-1/3 aspect-[4/5] overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </div>
             <div className="w-full md:w-1/3">
               <h4 className="text-5xl font-display mb-4">03. Sculptural Footwear</h4>
               <p className="text-zinc-400">Elevating every step.</p>
             </div>
          </div>
          {/* Panel 4 - View All */}
          <div className="horizontal-panel w-screen h-full flex flex-col items-center justify-center p-10 text-center">
             <h4 className="text-6xl md:text-8xl font-display mb-8">Ready to explore?</h4>
             <Link href="/shop" className="px-12 py-5 bg-white text-black text-lg tracking-widest uppercase hover:bg-zinc-200 transition-colors">
               Enter Shop
             </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-4 md:px-10 text-center relative overflow-hidden">
        <h2 className="text-[18vw] font-display font-bold leading-none text-zinc-100 dark:text-zinc-900 pointer-events-none select-none">AURA</h2>
      </footer>
    </main>
  );
}
