"use client";

import { motion } from "framer-motion";
import { Package, Heart, Star, Bell, MapPin, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDashboardPage() {
  const [greeting, setGreeting] = useState("Good day");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/30">
      <div className="max-w-screen-xl mx-auto px-4 md:px-10">
        
        {/* Header */}
        <header className="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display mb-2">{greeting}, Alexander</h1>
            <p className="text-muted-foreground">Manage your orders, profile, and preferences.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-background border border-border px-4 py-2 flex items-center shadow-sm">
              <Star size={16} className="text-yellow-500 mr-2" />
              <span className="font-medium mr-2">AURA Elite</span>
              <span className="text-muted-foreground text-sm">| 12,450 pts</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Sidebar Nav */}
          <aside className="lg:col-span-3">
            <nav className="space-y-2 sticky top-24">
              <a href="#" className="flex items-center justify-between p-4 bg-background border border-border text-foreground shadow-sm">
                <span className="flex items-center font-medium"><Package size={18} className="mr-3" /> Orders & Returns</span>
                <ChevronRight size={16} />
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-transparent border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-all">
                <span className="flex items-center font-medium"><MapPin size={18} className="mr-3" /> Addresses</span>
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-transparent border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-all">
                <span className="flex items-center font-medium"><Heart size={18} className="mr-3" /> Wishlist</span>
              </a>
              <a href="#" className="flex items-center justify-between p-4 bg-transparent border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-all">
                <span className="flex items-center font-medium"><Bell size={18} className="mr-3" /> Notifications</span>
              </a>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-8">
            
            {/* Active Order / Tracking */}
            <section className="bg-background border border-border p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <MapPin size={120} />
              </div>
              <h2 className="text-lg font-medium mb-6 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-3"></span>
                Active Shipment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Order #84920</p>
                  <h3 className="text-2xl font-display mb-4">In Transit</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex text-sm">
                      <div className="w-1/3 text-muted-foreground">Carrier</div>
                      <div className="w-2/3 font-medium">DHL Express</div>
                    </div>
                    <div className="flex text-sm">
                      <div className="w-1/3 text-muted-foreground">Est. Delivery</div>
                      <div className="w-2/3 font-medium">Tomorrow, by 12:00 PM</div>
                    </div>
                  </div>
                  
                  <Link href="/dashboard/tracking" className="text-sm font-medium underline uppercase tracking-widest">
                    Track Package
                  </Link>
                </div>
                
                {/* Visual Progress Map Placeholder */}
                <div className="h-48 bg-muted border border-border flex items-center justify-center relative rounded-md overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600" className="opacity-50 object-cover w-full h-full grayscale" alt="Map" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur border border-border p-3 text-xs flex justify-between items-center rounded">
                     <span>Last scanned: Sort Facility, NY</span>
                     <span className="font-mono text-muted-foreground">10:45 AM</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Orders */}
            <section>
              <h2 className="text-xl font-display mb-4">Recent Orders</h2>
              <div className="bg-background border border-border shadow-sm">
                <div className="divide-y divide-border">
                  {[1, 2].map((order) => (
                    <div key={order} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex -space-x-4">
                          <div className="w-16 h-20 bg-muted border border-background">
                             <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Delivered • Oct 12</p>
                          <h4 className="font-medium">The Essential Overcoat</h4>
                          <p className="text-sm text-muted-foreground mt-1">Order #8491{order}</p>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                        <span className="font-mono font-medium">$495.00</span>
                        <div className="flex space-x-3">
                          <button className="text-xs uppercase tracking-widest font-medium underline">Buy Again</button>
                          <button className="text-xs uppercase tracking-widest font-medium text-muted-foreground hover:text-foreground">Return</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border bg-muted/20 text-center">
                  <button className="text-xs uppercase tracking-widest font-medium text-muted-foreground hover:text-foreground">View All Orders</button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
