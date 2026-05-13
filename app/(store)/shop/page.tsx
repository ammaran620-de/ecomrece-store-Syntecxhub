"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";

const PRODUCTS = [
  { id: "1", name: "The Essential Overcoat", price: "$495", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800", category: "Outerwear" },
  { id: "2", name: "Silk Crepe Blouse", price: "$225", image: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800", category: "Tops" },
  { id: "3", name: "Pleated Wool Trousers", price: "$350", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800", category: "Bottoms" },
  { id: "4", name: "Leather Crossbody", price: "$580", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800", category: "Accessories" },
  { id: "5", name: "Cashmere Turtleneck", price: "$320", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800", category: "Knitwear" },
  { id: "6", name: "Structural Blazer", price: "$650", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", category: "Outerwear" },
];

export default function ShopPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-10 max-w-screen-2xl mx-auto">
      <header className="flex justify-between items-end mb-12 border-b border-border pb-6">
        <div>
          <h1 className="text-5xl font-display mb-2">Collection</h1>
          <p className="text-muted-foreground">Discover our latest arrivals.</p>
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 border border-border px-4 py-2 hover:bg-muted transition-colors"
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Filters Sidebar (simplified) */}
        {isFilterOpen && (
          <motion.aside 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 250 }}
            className="hidden md:block flex-shrink-0"
          >
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-medium mb-4 uppercase tracking-widest text-sm">Category</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground">All</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Outerwear</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Tops</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Bottoms</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Accessories</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4 uppercase tracking-widest text-sm">Price</h3>
                {/* Custom Range Slider would go here */}
                <div className="h-1 w-full bg-border relative">
                  <div className="absolute left-0 right-1/2 top-0 bottom-0 bg-foreground"></div>
                </div>
                <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {PRODUCTS.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/shop/${product.id}`}>
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-black px-6 py-3 font-medium uppercase tracking-wider text-xs transform translate-y-4 group-hover:translate-y-0 transition-all">
                        Quick Add
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                      <h3 className="font-medium">{product.name}</h3>
                    </div>
                    <p className="font-mono">{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
