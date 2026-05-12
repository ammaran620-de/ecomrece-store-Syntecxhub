"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";

// Placeholder 3D Model Component
function Model() {
  // Normally useGLTF from a URL. We use a placeholder mesh for now.
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#444" roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState("black");

  return (
    <div className="min-h-screen pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        
        {/* Left: Media Gallery / 3D Viewer */}
        <div className="relative bg-muted lg:sticky lg:top-20 h-[50vh] lg:h-[calc(100vh-80px)] overflow-hidden">
          {/* <img src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200" className="w-full h-full object-cover" /> */}
          <div className="absolute inset-0 z-10 pointer-events-none p-6 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-medium px-3 py-1 border border-foreground/10 glass rounded-full">3D View</span>
          </div>
          <Canvas className="w-full h-full cursor-grab active:cursor-grabbing">
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <Model />
            <Environment preset="city" />
            <OrbitControls autoRotate enableZoom={false} />
          </Canvas>
        </div>

        {/* Right: Product Info */}
        <div className="px-6 py-12 md:px-16 md:py-20 lg:py-32 flex flex-col justify-center">
          <div className="max-w-xl mx-auto w-full">
            <nav className="flex items-center text-sm text-muted-foreground mb-8 space-x-2">
              <span>Shop</span> <ChevronRight size={14} /> <span>Outerwear</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-display mb-4">The Essential Overcoat</h1>
            <p className="font-mono text-2xl mb-8">$495.00</p>

            <div className="mb-10">
              <h3 className="text-sm font-medium uppercase tracking-widest mb-4">Color: {selectedColor}</h3>
              <div className="flex space-x-4">
                {["black", "camel", "navy"].map((c) => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === c ? 'border-foreground p-1' : 'border-transparent'}`}
                  >
                    <span 
                      className="block w-full h-full rounded-full" 
                      style={{ backgroundColor: c === 'camel' ? '#c19a6b' : c === 'navy' ? '#000080' : c }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-medium uppercase tracking-widest mb-4 flex justify-between">
                <span>Size</span>
                <span className="text-muted-foreground underline cursor-pointer">Size Guide</span>
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {["S", "M", "L", "XL"].map((s) => (
                  <button key={s} className="border border-border py-3 text-center hover:border-foreground transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky add to cart bar on mobile, normal button here */}
            <button className="w-full bg-foreground text-background py-5 text-lg font-medium tracking-wide hover:bg-zinc-800 transition-colors mb-4 flex items-center justify-center space-x-2">
              <span>ADD TO CART</span>
            </button>
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center space-x-2 mb-16">
              <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
              <span>In Stock - Ships within 24h</span>
            </p>

            {/* Tabs */}
            <div className="border-t border-border pt-8">
              <div className="flex space-x-8 border-b border-border mb-6">
                {["description", "details", "sustainability"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 uppercase tracking-widest text-xs font-medium transition-colors relative ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-foreground" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                {activeTab === 'description' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p>Meticulously tailored from double-faced Italian wool, this overcoat offers an unstructured silhouette that drapes elegantly. The unlined interior ensures lightweight warmth without the bulk.</p>
                  </motion.div>
                )}
                {activeTab === 'details' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>100% Virgin Wool</li>
                      <li>Horn buttons</li>
                      <li>Patch pockets</li>
                      <li>Dry clean only</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
