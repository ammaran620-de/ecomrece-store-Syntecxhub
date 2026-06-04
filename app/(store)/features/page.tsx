export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Everything you need to succeed</h1>
        <p className="text-xl text-zinc-600">AURA comes packed with enterprise-grade features out of the box.</p>
      </div>
      
      <div className="max-w-5xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4">Build your brand</h3>
            <p className="text-lg text-zinc-600">No design skills needed. Choose from our beautiful, responsive themes and customize every detail to match your brand perfectly using our intuitive drag-and-drop builder.</p>
          </div>
          <div className="flex-1 w-full bg-zinc-100 aspect-video rounded-2xl border border-zinc-200 flex items-center justify-center p-8">
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-zinc-200"></div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4">Manage with ease</h3>
            <p className="text-lg text-zinc-600">From inventory tracking to order fulfillment, AURA's powerful dashboard puts you in complete control of your business operations from a single place.</p>
          </div>
          <div className="flex-1 w-full bg-zinc-100 aspect-video rounded-2xl border border-zinc-200 flex items-center justify-center p-8">
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-zinc-200"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
