"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, MessageCircle, Mail, HelpCircle, Truck, CreditCard, ShieldCheck, RefreshCw } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "shipping" | "payments" | "products" | "returns";
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "shipping",
    question: "How long does courier shipping take?",
    answer: "We process and ship all orders within 24 hours. Courier delivery within Pakistan takes 2-3 business days. Free courier shipping is automatically enabled on all orders."
  },
  {
    category: "shipping",
    question: "Can I track my order delivery?",
    answer: "Yes. As soon as your order is confirmed, you will receive a tracking link via email and SMS. You can also monitor your live dispatch status directly from your user dashboard."
  },
  {
    category: "payments",
    question: "What payment methods are supported?",
    answer: "We support Cash on Delivery (COD) as our primary choice for hassle-free shopping. We also accept local bank transfers, Easypaisa, and JazzCash routing on demand."
  },
  {
    category: "payments",
    question: "Is checkout secure?",
    answer: "Absolutely. All transactions are encrypted and handled through secure SSL channels. We ensure your personal details and billing parameters remain strictly confidential."
  },
  {
    category: "products",
    question: "How do I choose the correct garment size?",
    answer: "Each product details page includes a detailed Size Guide specifying chest, sleeve, and shoulder dimensions. Our apparel is designed for standard unstructured silhouettes."
  },
  {
    category: "products",
    question: "Where are AURA garments manufactured?",
    answer: "All AURA products are designed and crafted using premium materials, utilizing double-faced Italian virgin wool, long-staple mulberry silks, and reinforced stitch threads."
  },
  {
    category: "returns",
    question: "What is your return and refund policy?",
    answer: "We offer a 30-day premium return policy. Items must be unworn, in their original packaging, and carrying all factory tags intact. Refunds are processed within 3 business days."
  },
  {
    category: "returns",
    question: "How do I initiate a product exchange?",
    answer: "You can initiate exchanges by sending an email to support@aura.com or requesting an exchange in your order history panel. We arrange doorstep courier pickup for you."
  }
];

const CATEGORIES = [
  { id: "all", label: "ALL TOPICS", icon: HelpCircle },
  { id: "shipping", label: "SHIPPING", icon: Truck },
  { id: "payments", label: "PAYMENTS & COD", icon: CreditCard },
  { id: "products", label: "FIT & PRODUCTS", icon: ShieldCheck },
  { id: "returns", label: "RETURNS", icon: RefreshCw }
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filtered FAQ selection
  const filteredFAQs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch = 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-void min-h-screen text-text-primary pt-32 pb-24 px-4 md:px-10 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent-primary/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent-gold/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <header className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <span className="text-accent-primary text-xs font-mono tracking-[0.25em] uppercase">KNOWLEDGE ARCHIVE</span>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-text-primary to-text-secondary leading-tight">
          SUPPORT & FAQS
        </h1>
        <p className="text-text-secondary text-sm md:text-base mt-4 max-w-lg mx-auto">
          Need clarification on orders, dimensions, or payments? Find quick solutions curated by the AURA support team below.
        </p>
      </header>

      {/* Real-time Search Box */}
      <div className="max-w-2xl mx-auto mb-12 relative z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs (e.g. shipping, size, cash on delivery)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setExpandedIndex(null);
            }}
            className="w-full bg-obsidian border border-border-dim rounded-2xl py-4 pl-12 pr-6 text-sm font-mono tracking-wide text-white placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/15 transition-all shadow-xl"
          />
          <Search size={18} className="absolute left-4 top-4.5 text-text-muted" />
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex flex-wrap justify-center gap-3 mb-16 relative z-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedIndex(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider border cursor-pointer transition-all duration-300 ${
                isActive 
                  ? "border-accent-primary bg-accent-primary/15 text-white shadow-lg shadow-accent-primary/5" 
                  : "border-border-dim bg-obsidian/40 text-text-secondary hover:border-text-secondary hover:text-white"
              }`}
            >
              <Icon size={12} className={isActive ? "text-accent-primary" : "text-text-muted"} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion FAQ list */}
      <div className="max-w-3xl mx-auto space-y-4 relative z-10 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-16 bg-obsidian/20 border border-border-dim rounded-2xl p-8"
            >
              <HelpCircle size={32} className="text-text-muted mx-auto mb-4 opacity-40" />
              <p className="text-sm font-mono text-text-muted uppercase">No matching FAQs found</p>
              <p className="text-xs text-text-secondary mt-1">Try refining your lookup query or selecting a different category.</p>
            </motion.div>
          ) : (
            filteredFAQs.map((faq, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <motion.div
                  key={faq.question}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`bg-obsidian/30 border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? "border-accent-primary/45 bg-obsidian/60" : "border-border-dim hover:border-border-dim*2"
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-base font-bold text-white group-hover:text-accent-ice transition-colors">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 p-1.5 rounded-full bg-chrome ${isOpen ? "text-accent-primary" : "text-text-muted"}`}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-sm text-text-secondary leading-relaxed border-t border-border-dim/20 font-mono">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Help Desk Callout Banner */}
      <section className="max-w-3xl mx-auto mt-24 bg-obsidian border border-border-dim rounded-2xl p-8 text-center relative z-10 glass-panel shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left space-y-2">
          <h3 className="text-xl font-bold text-white">Still have questions?</h3>
          <p className="text-text-secondary text-xs max-w-md leading-relaxed">
            Our support archive team is active 24/7. Connect with us directly via support ticket or direct email lookup.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <a
            href="mailto:support@aura.com"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-chrome border border-border-dim hover:border-accent-primary text-xs font-mono text-white rounded-lg transition-all"
          >
            <Mail size={14} />
            <span>EMAIL SUPPORT</span>
          </a>
          <button
            onClick={() => alert("Initializing Neural Support Ticket Terminal...")}
            className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary text-white text-xs font-bold uppercase rounded-lg hover:bg-opacity-95 transition-all shadow-md shadow-accent-primary/10 cursor-pointer"
          >
            <MessageCircle size={14} />
            <span>OPEN TICKET</span>
          </button>
        </div>
      </section>

    </div>
  );
}
