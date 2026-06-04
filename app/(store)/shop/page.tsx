"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Search, Star, Heart, X, Sparkles, ChevronRight, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

// Static mock categories, brands, colors, and items
const CATEGORIES = ["Outerwear", "Knitwear", "Tops", "Bottoms", "Footwear", "Accessories", "Tailoring", "Fine Jewelry"];
const BRANDS = ["Aether", "Spectra", "Nova", "Zenith", "Apex"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Navy", hex: "#000080" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Ivory", hex: "#FFFFF0" }
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  "Outerwear": [
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800"
  ],
  "Knitwear": [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800",
    "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800"
  ],
  "Tops": [
    "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800"
  ],
  "Bottoms": [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800"
  ],
  "Footwear": [
    "https://images.unsplash.com/photo-1614252329376-788d2f6274b0?q=80&w=800",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800"
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
    "https://images.unsplash.com/photo-1627124118400-019d5f0ce637?q=80&w=800"
  ],
  "Tailoring": [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800",
    "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800"
  ],
  "Fine Jewelry": [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
  ]
};


function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, openCart } = useCartStore();

  // Search parameters syncing states
  const categoryFilter = searchParams.get("category") || "All";
  const brandFilter = searchParams.get("brand") || "All";
  const querySearch = searchParams.get("search") || "";
  const sortType = searchParams.get("sort") || "featured";

  // Client local interactive states
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Command Palette states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  // Infinite Scroll mock list pagination
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Programmatic generation of 24 catalogue products
  const products = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 24; i++) {
      const cat = CATEGORIES[(i - 1) % CATEGORIES.length];
      const brand = BRANDS[(i - 1) % BRANDS.length];
      const basePrice = 120 + (i * 18);
      const isAltHeight = i % 2 === 0;

      list.push({
        id: `var-${i}-1`,
        slug: `${brand.toLowerCase()}-${cat.toLowerCase()}-item-${i}`,
        name: `${brand} ${cat === "Fine Jewelry" ? "Band" : cat === "Footwear" ? "Loafer" : "Essential"} ${i}`,
        price: basePrice,
        compareAtPrice: Math.round(basePrice * 1.3),
        category: cat,
        brand: brand,
        rating: 4 + (i % 2 === 0 ? 1 : 0.5),
        color: COLORS[(i - 1) % COLORS.length].name,
        isAltHeight,
        images: [
          CATEGORY_IMAGES[cat]?.[(i - 1) % (CATEGORY_IMAGES[cat]?.length || 1)] || "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
          CATEGORY_IMAGES[cat]?.[i % (CATEGORY_IMAGES[cat]?.length || 1)] || "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800"
        ],
        desc: `Luxurious custom-designed ${cat}.`
      });
    }
    return list;
  }, []);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter !== "All") {
      list = list.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (brandFilter !== "All") {
      list = list.filter(p => p.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    if (querySearch) {
      const q = querySearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    list = list.filter(p => p.price <= priceRange);

    if (selectedColors.length > 0) {
      list = list.filter(p => selectedColors.includes(p.color));
    }

    if (selectedRating !== null) {
      list = list.filter(p => p.rating >= selectedRating);
    }

    // Sort operations
    if (sortType === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortType === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, categoryFilter, brandFilter, querySearch, priceRange, selectedColors, selectedRating, sortType]);

  // Sync URL parameters helper
  const updateQuery = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "All" || !val) {
      params.delete(key);
    } else {
      params.set(key, val);
    }
    router.push(`/shop?${params.toString()}`);
  };

  // Keyboard CMD+K event setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
        setVisibleCount(prev => Math.min(prev + 6, filteredProducts.length));
      }
    }, { threshold: 0.1 });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [observerRef, visibleCount, filteredProducts]);

  // Wishlist toggle
  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      variant: `${product.color} / M`,
    });
    openCart();
  };

  // Command Palette Navigation Matches
  const commandMatches = useMemo(() => {
    if (!commandQuery) return [];
    const q = commandQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 5);
  }, [commandQuery, products]);

  return (
    <div className="bg-void min-h-screen px-4 md:px-10 py-12 max-w-7xl mx-auto text-text-primary">
      
      {/* Search Header Banner */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-border-dim pb-8 mb-12 gap-6 pt-10">
        <div>
          <span className="text-accent-primary text-xs font-mono tracking-[0.2em] uppercase">AURA ARCHIVE</span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold mt-3">CATALOGUE</h1>
          <p className="text-text-secondary text-sm mt-2 max-w-md">
            Enter <kbd className="bg-chrome px-2 py-0.5 rounded border border-border-dim text-accent-ice text-xs">CMD+K</kbd> to activate the neural navigation terminal.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 border border-border-dim px-5 py-3 rounded-lg bg-obsidian text-sm font-medium hover:border-accent-primary hover:text-white transition-all cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          <select 
            value={sortType}
            onChange={(e) => updateQuery("sort", e.target.value)}
            className="bg-obsidian border border-border-dim px-5 py-3 rounded-lg text-sm focus:outline-none focus:border-accent-primary font-medium tracking-wide text-text-primary cursor-pointer"
          >
            <option value="featured">Featured Releases</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sticky Filters Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside
              initial={{ opacity: 0, width: 0, marginRight: 0 }}
              animate={{ opacity: 1, width: 280, marginRight: 24 }}
              exit={{ opacity: 0, width: 0, marginRight: 0 }}
              className="flex-shrink-0"
            >
              <div className="sticky top-28 space-y-8 bg-obsidian p-6 rounded-2xl border border-border-dim glass-panel">
                
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted mb-4">CATEGORIES</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => updateQuery("category", "All")}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all cursor-pointer ${categoryFilter === "All" ? "border-accent-primary bg-accent-primary/20 text-white" : "border-border-dim hover:border-text-secondary"}`}
                    >
                      ALL
                    </button>
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => updateQuery("category", cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all cursor-pointer ${categoryFilter.toLowerCase() === cat.toLowerCase() ? "border-accent-primary bg-accent-primary/20 text-white" : "border-border-dim hover:border-text-secondary"}`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted mb-4">BRANDS</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => updateQuery("brand", "All")}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all cursor-pointer ${brandFilter === "All" ? "border-accent-primary bg-accent-primary/20 text-white" : "border-border-dim hover:border-text-secondary"}`}
                    >
                      ALL
                    </button>
                    {BRANDS.map(brand => (
                      <button 
                        key={brand}
                        onClick={() => updateQuery("brand", brand)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide border transition-all cursor-pointer ${brandFilter.toLowerCase() === brand.toLowerCase() ? "border-accent-primary bg-accent-primary/20 text-white" : "border-border-dim hover:border-text-secondary"}`}
                      >
                        {brand.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted">MAX PRICE</h3>
                    <span className="text-xs font-mono text-accent-gold font-bold">${priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={priceRange} 
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-accent-primary cursor-pointer"
                  />
                </div>

                {/* Colors Toggle */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted mb-4">COLORS</h3>
                  <div className="flex gap-3">
                    {COLORS.map(c => {
                      const isSelected = selectedColors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColors(prev => 
                            isSelected ? prev.filter(col => col !== c.name) : [...prev, c.name]
                          )}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${isSelected ? "ring-2 ring-accent-primary scale-110" : "border-white/25"}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {isSelected && <Check size={10} className={c.name === "Ivory" ? "text-black" : "text-white"} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted mb-4">MIN RATING</h3>
                  <div className="flex gap-2">
                    {[5, 4, 3].map(stars => (
                      <button
                        key={stars}
                        onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                        className={`flex items-center gap-1 border border-border-dim px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${selectedRating === stars ? "border-accent-gold bg-accent-gold/10 text-accent-gold" : "hover:border-text-secondary"}`}
                      >
                        <span>{stars}</span>
                        <Star size={10} className="fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Product Listing Main Container */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-obsidian rounded-2xl border border-border-dim glass-panel flex flex-col items-center justify-center space-y-4">
              <span className="text-text-muted text-sm font-mono uppercase">NO MATCHES FOUND</span>
              <p className="text-text-secondary text-xs max-w-xs">Adjust your parameter filters or type a new lookup expression.</p>
              <button 
                onClick={() => {
                  setPriceRange(1000);
                  setSelectedColors([]);
                  setSelectedRating(null);
                  router.push("/shop");
                }}
                className="px-6 py-2.5 bg-accent-primary text-white text-xs font-bold rounded uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filteredProducts.slice(0, visibleCount).map((product) => {
                const isFavorite = wishlist.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    layoutId={product.id}
                    className="group bg-obsidian border border-border-dim rounded-2xl p-4 flex flex-col justify-between glass-panel transition-all duration-300 hover:border-accent-primary/20"
                  >
                    <div>
                      {/* Product Image Crossfade Hover Container */}
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-void mb-4 group cursor-pointer">
                        <Link href={`/shop/${product.slug}`}>
                          {/* Featured Main Image */}
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                          />
                          {/* Secondary Hover Lifestyle Image */}
                          <img 
                            src={product.images[1]} 
                            alt={`${product.name} lifestyle`}
                            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                          />
                        </Link>

                        {/* Top floating chips */}
                        <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
                          <span className="bg-void/80 backdrop-blur-md text-text-secondary text-[9px] font-mono px-2.5 py-1 rounded-full border border-border-dim">
                            {product.category}
                          </span>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product.id);
                            }}
                            className="p-1.5 bg-void/80 backdrop-blur-md rounded-full border border-border-dim text-text-muted hover:text-red-500 transition-colors pointer-events-auto cursor-pointer"
                          >
                            <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                          </button>
                        </div>

                        {/* Bottom Overlay Quick Add Button */}
                        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickAdd(product);
                            }}
                            className="px-5 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-[10px] rounded shadow-lg pointer-events-auto hover:bg-accent-ice transition-colors cursor-pointer"
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>

                      {/* Product Title and prices */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-1">{product.brand}</p>
                          <Link href={`/shop/${product.slug}`} className="hover:text-accent-primary transition-colors">
                            <h3 className="font-display font-bold text-lg text-white leading-tight">{product.name}</h3>
                          </Link>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-base text-accent-gold block">${product.price}</span>
                          <span className="font-mono text-[10px] text-text-muted line-through block">${product.compareAtPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer stars and details */}
                    <div className="flex items-center justify-between border-t border-border-dim/40 pt-4 mt-4">
                      <div className="flex items-center gap-1 text-accent-gold text-xs font-mono">
                        <Star size={12} className="fill-current" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] font-mono text-text-secondary">{product.color}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Infinite Scroll trigger target */}
          {visibleCount < filteredProducts.length && (
            <div ref={observerRef} className="py-16 flex justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-border-dim border-t-accent-primary animate-spin" />
            </div>
          )}
        </main>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommandPaletteOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ y: -20, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -20, scale: 0.95, opacity: 0 }}
              className="bg-obsidian border border-border-dim rounded-2xl w-full max-w-xl overflow-hidden glass-panel shadow-2xl z-10 flex flex-col"
            >
              {/* Input field */}
              <div className="p-4 border-b border-border-dim flex items-center gap-3">
                <Search size={18} className="text-text-muted" />
                <input
                  type="text"
                  placeholder="Type product name, category, brand or command expression..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-sm font-mono tracking-wide text-white placeholder-text-muted focus:ring-0"
                  autoFocus
                />
                <button 
                  onClick={() => setCommandPaletteOpen(false)}
                  className="p-1 hover:bg-chrome rounded text-text-muted"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Suggestions list */}
              <div className="max-h-[350px] overflow-y-auto p-4 space-y-4">
                {commandQuery ? (
                  commandMatches.length === 0 ? (
                    <p className="text-xs text-text-muted font-mono p-4">No results matching query expression.</p>
                  ) : (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2 px-3">SEARCH RESULTS</h4>
                      {commandMatches.map(p => (
                        <Link
                          key={p.id}
                          href={`/shop/${p.slug}`}
                          onClick={() => setCommandPaletteOpen(false)}
                          className="flex items-center gap-4 p-3 hover:bg-chrome rounded-lg transition-colors group"
                        >
                          <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded bg-void" />
                          <div className="flex-grow">
                            <span className="text-xs font-mono text-text-muted block">{p.category}</span>
                            <span className="text-sm font-bold text-white group-hover:text-accent-ice transition-colors">{p.name}</span>
                          </div>
                          <ChevronRight size={14} className="text-text-muted" />
                        </Link>
                      ))}
                    </div>
                  )
                ) : (
                  <>
                    {/* Quick navigation */}
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2 px-3">QUICK LINKS</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => { router.push("/shop"); setCommandPaletteOpen(false); }}
                          className="p-3 hover:bg-chrome rounded-lg text-left text-xs font-mono text-white flex items-center justify-between"
                        >
                          <span>ALL ARCHIVES</span>
                          <ChevronRight size={12} />
                        </button>
                        <button 
                          onClick={() => { router.push("/dashboard"); setCommandPaletteOpen(false); }}
                          className="p-3 hover:bg-chrome rounded-lg text-left text-xs font-mono text-white flex items-center justify-between"
                        >
                          <span>USER DASHBOARD</span>
                          <ChevronRight size={12} />
                        </button>
                        <button 
                          onClick={() => { router.push("/admin"); setCommandPaletteOpen(false); }}
                          className="p-3 hover:bg-chrome rounded-lg text-left text-xs font-mono text-accent-gold flex items-center justify-between"
                        >
                          <span>ADMIN PORTAL</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Popular Categories */}
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2 px-3">POPULAR SECTIONS</h4>
                      <div className="flex flex-wrap gap-2 px-3">
                        {CATEGORIES.slice(0, 4).map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              router.push(`/shop?category=${c}`);
                              setCommandPaletteOpen(false);
                            }}
                            className="px-3 py-1.5 bg-chrome border border-border-dim rounded text-xs font-mono text-text-secondary hover:border-accent-primary"
                          >
                            {c.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center text-xs font-mono text-text-muted">
        LOADING ARCHIVE ENTRIES...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
