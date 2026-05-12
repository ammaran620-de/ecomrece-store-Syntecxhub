"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Activity } from "lucide-react";
import { useEffect, useState } from "react";

// Placeholder data
const KPIs = [
  { id: 1, title: "Total Revenue", value: "$124,563.00", change: "+14.5%", isPositive: true, icon: DollarSign },
  { id: 2, title: "Orders", value: "842", change: "+5.2%", isPositive: true, icon: ShoppingCart },
  { id: 3, title: "Active Customers", value: "3,214", change: "-1.1%", isPositive: false, icon: Users },
  { id: 4, title: "Conversion Rate", value: "3.4%", change: "+0.8%", isPositive: true, icon: Activity },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPIs.map((kpi, i) => (
          <motion.div 
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-background border border-border p-6 rounded-xl shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-display font-medium tracking-tight">{kpi.value}</h3>
              </div>
              <div className="p-3 bg-muted rounded-lg text-foreground">
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {kpi.change}
              </span>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-background border border-border p-6 rounded-xl shadow-sm min-h-[400px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg">Revenue Overview</h3>
            <select className="bg-muted border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-muted-foreground">
            [ Interactive Chart Container (Recharts / Chart.js) ]
          </div>
        </motion.div>

        {/* Real-time Order Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-background border border-border p-6 rounded-xl shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-lg flex items-center">
              Live Orders
              <span className="ml-2 relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((order, i) => (
              <div key={order} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                    {`#${9845 - i}`}
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Order</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <p className="font-mono text-sm font-medium">${(Math.random() * 500 + 50).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
