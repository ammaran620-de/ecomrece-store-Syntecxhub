import { BarChart, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-display text-2xl tracking-widest">AURA<span className="text-muted-foreground text-sm ml-2 font-sans tracking-normal">Admin</span></span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-1">
            <Link href="/admin" className="flex items-center px-3 py-2 bg-muted text-foreground rounded-md text-sm font-medium">
              <BarChart size={18} className="mr-3 text-muted-foreground" /> Overview
            </Link>
            <Link href="/admin/orders" className="flex items-center px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors">
              <ShoppingCart size={18} className="mr-3" /> Orders
            </Link>
            <Link href="/admin/products" className="flex items-center px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors">
              <Package size={18} className="mr-3" /> Products
            </Link>
            <Link href="/admin/customers" className="flex items-center px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors">
              <Users size={18} className="mr-3" /> Customers
            </Link>
          </nav>
          
          <div className="mt-8 px-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">System</h4>
            <nav className="space-y-1">
              <Link href="/admin/settings" className="flex items-center px-3 py-2 text-muted-foreground hover:bg-muted/50 rounded-md text-sm font-medium transition-colors">
                <Settings size={18} className="mr-3" /> Settings
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <button className="flex items-center w-full px-3 py-2 text-muted-foreground hover:text-destructive transition-colors text-sm font-medium">
            <LogOut size={18} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10 flex items-center justify-between px-8">
          <h1 className="text-lg font-medium">Dashboard Overview</h1>
          <div className="flex items-center space-x-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="System Online"></span>
            <div className="w-8 h-8 bg-muted rounded-full overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="Admin" />
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
