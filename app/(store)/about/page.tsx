export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 px-4 md:px-10 max-w-screen-xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-display mb-12">Our Story</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
          <p>
            AURA was born out of a desire to create a wardrobe that speaks volumes without shouting. We believe that true luxury lies in the details—the precision of a cut, the weight of a fabric, the subtle interplay of light and shadow on a meticulously crafted garment.
          </p>
          <p>
            Our commitment to sustainability is unwavering. We partner with ethical artisans and utilize eco-conscious materials, ensuring that our pursuit of beauty does not compromise the world we live in.
          </p>
          <p>
            Welcome to the new standard of elegance.
          </p>
        </div>
        <div className="bg-muted aspect-[3/4] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000" className="w-full h-full object-cover" alt="About Aura" />
        </div>
      </div>
    </div>
  );
}
