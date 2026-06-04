"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { BarChart, Package, ShoppingCart, Users, Settings, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function AdminSidebar() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const { data: session } = useSession();

  const getLinkClass = (tabName: string) => {
    const isActive = currentTab === tabName;
    return `flex items-center px-4 py-3 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
      isActive 
        ? "border-l-2 border-accent-primary bg-accent-primary/10 text-white font-bold" 
        : "text-text-secondary hover:bg-chrome/30 hover:text-white"
    }`;
  };

  return (
    <aside className="w-64 bg-obsidian border-r border-border-dim flex flex-col justify-between z-20">
      <div>
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-border-dim gap-3">
          <div className="w-7 h-7 bg-accent-primary rounded flex items-center justify-center font-display font-black text-white text-xs">
            A
          </div>
          <span className="font-display font-extrabold tracking-widest text-white text-sm">
            AURA <span className="text-[10px] font-mono text-accent-gold font-bold">ADMIN</span>
          </span>
        </div>
        
        {/* Menu links */}
        <div className="py-6 px-4 space-y-1">
          <Link href="/admin?tab=overview" className={getLinkClass("overview")}>
            <BarChart size={16} className="mr-3 text-accent-primary" /> Overview
          </Link>
          <Link href="/admin?tab=orders" className={getLinkClass("orders")}>
            <ShoppingCart size={16} className="mr-3 text-accent-gold" /> Orders
          </Link>
          <Link href="/admin?tab=products" className={getLinkClass("products")}>
            <Package size={16} className="mr-3 text-accent-ice" /> Products
          </Link>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border-dim bg-void/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-chrome border border-border-dim overflow-hidden">
            <img src={session?.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"} alt="admin face" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-white font-bold block leading-tight">{session?.user?.name || "ADMIN USER"}</span>
            <span className="text-[8px] font-mono text-text-muted block">SYSTEM DEPLOYER</span>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-xs font-mono uppercase text-text-muted hover:text-red-500 transition-colors"
        >
          <LogOut size={16} className="mr-3" /> Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-void text-text-primary overflow-hidden">
      
      {/* Sidebar Panel */}
      <Suspense fallback={
        <aside className="w-64 bg-obsidian border-r border-border-dim flex flex-col justify-between z-20">
          <div>
            <div className="h-20 flex items-center px-6 border-b border-border-dim gap-3">
              <div className="w-7 h-7 bg-accent-primary rounded flex items-center justify-center font-display font-black text-white text-xs">
                A
              </div>
              <span className="font-display font-extrabold tracking-widest text-white text-sm">
                AURA <span className="text-[10px] font-mono text-accent-gold font-bold">ADMIN</span>
              </span>
            </div>
          </div>
        </aside>
      }>
        <AdminSidebar />
      </Suspense>

      {/* Main Panel Content container */}
      <main className="flex-1 overflow-y-auto relative bg-void flex flex-col">
        {/* Header bar */}
        <header className="h-20 bg-obsidian/80 backdrop-blur-md border-b border-border-dim sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <span className="text-text-muted text-xs font-mono uppercase">AURA ADMIN CORE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="text-[10px] font-mono text-text-secondary bg-chrome px-3 py-1 rounded border border-border-dim">
            SERVER LEVEL STATUS: 200 OK
          </div>
        </header>

        {/* Body content wrapper */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
