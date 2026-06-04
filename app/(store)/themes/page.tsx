export default function ThemesPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">AURA Theme Store</h1>
        <p className="text-xl text-zinc-600">Beautifully crafted themes designed to convert.</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-200 group cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] bg-zinc-200 overflow-hidden relative">
              <img src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop&sig=${i}`} className="w-full h-full object-cover opacity-50" alt={`Theme ${i}`} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-600/10 backdrop-blur-sm transition-all">
                <span className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold shadow-lg">Preview Theme</span>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Theme Name {i}</h3>
                <p className="text-zinc-500">Free</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
