export default function EditorialPage() {
  return (
    <div className="min-h-screen pt-32 px-4 md:px-10 max-w-screen-2xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-display mb-16 text-center">Editorial</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group cursor-pointer">
          <div className="bg-muted aspect-[4/5] overflow-hidden mb-6 relative">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Campaign 1" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-sm uppercase tracking-widest border border-white px-6 py-3">Read More</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Campaign • Fall 2026</p>
          <h2 className="text-3xl font-display">The Anatomy of Silence</h2>
        </div>
        
        <div className="group cursor-pointer mt-0 md:mt-24">
          <div className="bg-muted aspect-[4/5] overflow-hidden mb-6 relative">
            <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Campaign 2" />
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-sm uppercase tracking-widest border border-white px-6 py-3">Read More</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Interview • The Founders</p>
          <h2 className="text-3xl font-display">Crafting the Future of Luxury</h2>
        </div>
      </div>
    </div>
  );
}
