import { PrismaClient, Role, OrderStatus, DiscountType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed database...");

  // 1. Clear Existing Data (in order of dependencies)
  console.log("Cleaning old data...");
  await prisma.discountCode.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Brands (5)
  console.log("Seeding Brands...");
  const brandsData = [
    { name: "Aether", slug: "aether", logo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150" },
    { name: "Spectra", slug: "spectra", logo: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=150" },
    { name: "Nova", slug: "nova", logo: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=150" },
    { name: "Zenith", slug: "zenith", logo: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=150" },
    { name: "Apex", slug: "apex", logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=150" }
  ];
  const brands = [];
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brands.push(brand);
  }

  // 3. Seed Categories (10)
  console.log("Seeding Categories...");
  const categoriesData = [
    { name: "Outerwear", slug: "outerwear", description: "Premium coats, jackets, and parkas" },
    { name: "Knitwear", slug: "knitwear", description: "Luxurious cashmere, merino, and alpaca wool sweaters" },
    { name: "Tops", slug: "tops", description: "Silk blouses, fine cotton tees, and tailored shirts" },
    { name: "Bottoms", slug: "bottoms", description: "Tailored trousers, pleated skirts, and raw denim" },
    { name: "Footwear", slug: "footwear", description: "Handcrafted leather boots, loafers, and minimal sneakers" },
    { name: "Accessories", slug: "accessories", description: "Leather bags, belts, silk scarves, and cardholders" },
    { name: "Loungewear", slug: "loungewear", description: "Organic cotton basics, silk robes, and soft joggers" },
    { name: "Activewear", slug: "activewear", description: "Performance tech shirts, compression pants, and windbreakers" },
    { name: "Tailoring", slug: "tailoring", description: "Bespoke suits, blazers, and dress shirts" },
    { name: "Fine Jewelry", slug: "fine-jewelry", description: "Solid gold rings, minimalist necklaces, and cuff links" }
  ];
  const categories = [];
  for (const c of categoriesData) {
    const cat = await prisma.category.create({ data: c });
    categories.push(cat);
  }

  // 4. Seed Products & Variants (50 products)
  console.log("Seeding Products and Variants...");
  const colors = ["Black", "Camel", "Navy", "Silver", "Ivory"];
  const sizes = ["S", "M", "L", "XL"];
  const products = [];
  const variants = [];

  const categoryImagesMap: Record<string, string[]> = {
    "outerwear": [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800"
    ],
    "knitwear": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800"
    ],
    "tops": [
      "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800"
    ],
    "bottoms": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800"
    ],
    "footwear": [
      "https://images.unsplash.com/photo-1614252329376-788d2f6274b0?q=80&w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800"
    ],
    "accessories": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800",
      "https://images.unsplash.com/photo-1627124118400-019d5f0ce637?q=80&w=800"
    ],
    "loungewear": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800"
    ],
    "activewear": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=800"
    ],
    "tailoring": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800"
    ],
    "fine-jewelry": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
    ]
  };

  for (let i = 1; i <= 50; i++) {
    const catIdx = (i - 1) % categories.length;
    const brandIdx = (i - 1) % brands.length;
    const cat = categories[catIdx];
    const brand = brands[brandIdx];
    const priceBase = 150 + (i * 12);
    const catImages = categoryImagesMap[cat.slug] || [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800"
    ];

    const product = await prisma.product.create({
      data: {
        name: `${brand.name} ${cat.name === "Fine Jewelry" ? "Band" : cat.name === "Footwear" ? "Loafer" : "Essential"} ${i}`,
        slug: `${brand.slug}-${cat.slug}-item-${i}`,
        description: `This is the ultimate premium release of the ${brand.name} ${cat.name}. Engineered for comfort and tailored to perfection using the finest materials. Features water-resistant fibers and reinforced stitching details throughout.`,
        shortDescription: `A high-end, limited-edition ${cat.name} designed in collaboration with ${brand.name}.`,
        featured: i % 7 === 0,
        published: true,
        images: [
          catImages[(i - 1) % catImages.length],
          catImages[i % catImages.length]
        ],
        tags: [cat.slug, brand.slug, "luxury", "essential"],
        categoryId: cat.id,
        brandId: brand.id,
      }
    });
    products.push(product);

    // Create 3 variants per product
    for (let j = 0; j < 3; j++) {
      const color = colors[(i + j) % colors.length];
      const size = sizes[(i + j) % sizes.length];
      const sku = `AUR-${brand.slug.substring(0, 3).toUpperCase()}-${cat.slug.substring(0, 3).toUpperCase()}-${i}-${color.substring(0, 2).toUpperCase()}-${size}`;
      const varPrice = priceBase + (j * 15);
      
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          color,
          size,
          sku,
          price: varPrice,
          compareAtPrice: varPrice * 1.25,
          stock: Math.floor(Math.random() * 25) + 3, // at least 3 in stock
          images: product.images
        }
      });
      variants.push(variant);
    }
  }

  // 5. Seed Users (200)
  console.log("Seeding 200 Users...");
  const users = [];

  // Seed Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@aura.com",
      name: "AURA Admin",
      role: Role.ADMIN,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    }
  });
  users.push(adminUser);

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150",
    "https://images.unsplash.com/photo-1489980508314-941910ded1f4?q=80&w=150",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150"
  ];

  // Seed Customers
  for (let i = 1; i <= 199; i++) {
    const user = await prisma.user.create({
      data: {
        email: `customer${i}@aura.com`,
        name: `Customer Name ${i}`,
        role: Role.CUSTOMER,
        image: avatars[i % avatars.length]
      }
    });
    users.push(user);
  }

  // 6. Seed Addresses for Users (at least 1 per user)
  console.log("Seeding Addresses...");
  const addresses = [];
  const cities = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Sialkot", "Multan"];
  const countries = ["Pakistan"];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const city = cities[i % cities.length];
    const country = countries[0];
    const isDefault = true;

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name: user.name || "Default Address",
        line1: `House No ${i + 12}, Street ${i % 5 + 1}, Sector ${i % 3 === 0 ? "A" : "B"}`,
        line2: `Phase ${i % 2 + 1}, DHA`,
        city,
        state: city === "Karachi" ? "Sindh" : city === "Islamabad" ? "Capital Territory" : "Punjab",
        zip: `${40000 + i}`,
        country,
        isDefault
      }
    });
    addresses.push(address);

    // Some users get a second shipping address
    if (i % 3 === 0) {
      await prisma.address.create({
        data: {
          userId: user.id,
          name: `${user.name || "Default"} Office`,
          line1: `Office No ${i + 1}, Tech Tower, Karsaz Road`,
          city: "Karachi",
          state: "Sindh",
          zip: "75350",
          country: "Pakistan",
          isDefault: false
        }
      });
    }
  }

  // 7. Seed Orders (500 orders)
  console.log("Seeding 500 Orders (This might take a second)...");
  const statuses = [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PROCESSING, OrderStatus.PENDING, OrderStatus.CANCELLED];
  const orderItemsData = [];

  for (let i = 1; i <= 500; i++) {
    const user = users[i % users.length];
    const userAddresses = addresses.filter(a => a.userId === user.id);
    const addr = userAddresses[0] || addresses[0];
    const status = i <= 400 ? OrderStatus.DELIVERED 
                 : i <= 450 ? OrderStatus.SHIPPED 
                 : i <= 480 ? OrderStatus.PROCESSING 
                 : i <= 495 ? OrderStatus.PENDING 
                 : OrderStatus.CANCELLED;

    // Pick 1-3 random variants
    const numItems = Math.floor(Math.random() * 3) + 1;
    let orderSubtotal = 0;
    const selectedVariants = [];

    for (let k = 0; k < numItems; k++) {
      const v = variants[Math.floor(Math.random() * variants.length)];
      selectedVariants.push(v);
      orderSubtotal += Number(v.price) * (k + 1);
    }

    const shipping = orderSubtotal > 300 ? 0 : 15;
    const total = orderSubtotal + shipping;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status,
        subtotal: orderSubtotal,
        shippingCost: shipping,
        total,
        stripePaymentIntentId: status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED ? `pi_mock_${i}_${Math.random().toString(36).substring(7)}` : null,
        shippingAddressId: addr.id,
        createdAt: new Date(Date.now() - (500 - i) * 60 * 60 * 1000) // spread over last ~20 days
      }
    });

    for (let k = 0; k < selectedVariants.length; k++) {
      const v = selectedVariants[k];
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: v.id,
          quantity: k + 1,
          priceAtPurchase: v.price
        }
      });
    }
  }

  // 8. Seed Reviews (100)
  console.log("Seeding Reviews...");
  const reviewsData = [
    { title: "Absolutely Stunning", body: "The design is top tier. Fits perfectly and looks incredibly clean.", rating: 5 },
    { title: "Exceptional Quality", body: "You can feel the luxury. Best purchase of this year, AURA delivers.", rating: 5 },
    { title: "Premium Fit", body: "Stitching is top notch. Fabric feels soft and breathable. Highly recommend.", rating: 4 },
    { title: "Solid Build", body: "Premium texture, but shipping took a day longer than expected. Still 5 stars for product.", rating: 5 },
    { title: "Good but pricey", body: "The cost is high but you get what you pay for. Very elegant finish.", rating: 4 }
  ];

  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const revTemplate = reviewsData[i % reviewsData.length];

    await prisma.review.create({
      data: {
        userId: user.id,
        productId: product.id,
        rating: revTemplate.rating,
        title: revTemplate.title,
        body: revTemplate.body,
        verified: i % 2 === 0,
        helpfulVotes: Math.floor(Math.random() * 12)
      }
    });
  }

  // 9. Seed Wishlist items
  console.log("Seeding Wishlists...");
  for (let i = 0; i < 60; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const variant = variants[Math.floor(Math.random() * variants.length)];
    try {
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          variantId: variant.id
        }
      });
    } catch (e) {
      // Ignore unique constraint collisions in seed
    }
  }

  // 10. Seed Discount Codes
  console.log("Seeding Discount Codes...");
  await prisma.discountCode.create({
    data: {
      code: "AURA20",
      type: DiscountType.PERCENTAGE,
      value: 20.00,
      maxUses: 1000,
      usedCount: 150,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });
  await prisma.discountCode.create({
    data: {
      code: "LUXURY50",
      type: DiscountType.FIXED,
      value: 50.00,
      maxUses: 500,
      usedCount: 20,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
