import fs from "fs";
import path from "path";

// File path for persistent mock DB
const MOCK_DB_FILE = path.join(process.cwd(), "lib", "db", "mockDb.json");

export interface MockBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string | null;
}

export interface MockProductVariant {
  id: string;
  productId: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images: string[];
}

export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  featured: boolean;
  published: boolean;
  images: string[];
  tags: string[];
  categoryId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations mapped
  brand?: MockBrand;
  category?: MockCategory;
  variants?: MockProductVariant[];
  reviews?: MockReview[];
}

export interface MockUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
}

export interface MockAddress {
  id: string;
  userId: string;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface MockOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
  
  // Mapped relation
  variant?: MockProductVariant;
}

export interface MockOrder {
  id: string;
  userId?: string | null;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  shippingCost: number;
  total: number;
  stripePaymentIntentId?: string | null;
  shippingAddressId: string;
  createdAt: string;
  updatedAt: string;
  
  // Mapped relations
  items?: MockOrderItem[];
  shippingAddress?: MockAddress;
  user?: MockUser | null;
}

export interface MockReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  helpfulVotes: number;
  verified: boolean;
  createdAt: string;
  
  // Mapped relations
  user?: MockUser;
}

export interface MockWishlist {
  id: string;
  userId: string;
  variantId: string;
  addedAt: string;
  
  // Mapped relation
  variant?: MockProductVariant;
}

export interface MockDiscountCode {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: string | null;
}

interface MockDatabaseSchema {
  brands: MockBrand[];
  categories: MockCategory[];
  products: MockProduct[];
  variants: MockProductVariant[];
  users: MockUser[];
  addresses: MockAddress[];
  orders: MockOrder[];
  orderItems: MockOrderItem[];
  reviews: MockReview[];
  wishlist: MockWishlist[];
  discountCodes: MockDiscountCode[];
}

// Generate complete high-fidelity initial seed data
function generateSeedData(): MockDatabaseSchema {
  const brands: MockBrand[] = [
    { id: "brand-1", name: "Aether", slug: "aether", logo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150" },
    { id: "brand-2", name: "Spectra", slug: "spectra", logo: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=150" },
    { id: "brand-3", name: "Nova", slug: "nova", logo: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=150" },
    { id: "brand-4", name: "Zenith", slug: "zenith", logo: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=150" },
    { id: "brand-5", name: "Apex", slug: "apex", logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=150" }
  ];

  const categories: MockCategory[] = [
    { id: "cat-1", name: "Outerwear", slug: "outerwear", description: "Premium coats, jackets, and parkas" },
    { id: "cat-2", name: "Knitwear", slug: "knitwear", description: "Luxurious cashmere, merino, and alpaca wool" },
    { id: "cat-3", name: "Tops", slug: "tops", description: "Silk blouses, fine cotton tees, and tailored shirts" },
    { id: "cat-4", name: "Bottoms", slug: "bottoms", description: "Tailored trousers, pleated skirts, and raw denim" },
    { id: "cat-5", name: "Footwear", slug: "footwear", description: "Handcrafted leather boots, loafers, and minimal sneakers" },
    { id: "cat-6", name: "Accessories", slug: "accessories", description: "Leather bags, belts, silk scarves, and cardholders" },
    { id: "cat-7", name: "Loungewear", slug: "loungewear", description: "Organic cotton basics, silk robes, and soft joggers" },
    { id: "cat-8", name: "Activewear", slug: "activewear", description: "Performance tech shirts, compression pants" },
    { id: "cat-9", name: "Tailoring", slug: "tailoring", description: "Bespoke suits, blazers, and dress shirts" },
    { id: "cat-10", name: "Fine Jewelry", slug: "fine-jewelry", description: "Solid gold rings, minimalist necklaces" }
  ];

  const categoryImagesMap: Record<string, string[]> = {
    "cat-1": [ // Outerwear
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800"
    ],
    "cat-2": [ // Knitwear
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800"
    ],
    "cat-3": [ // Tops
      "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=800",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800"
    ],
    "cat-4": [ // Bottoms
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800"
    ],
    "cat-5": [ // Footwear
      "https://images.unsplash.com/photo-1614252329376-788d2f6274b0?q=80&w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800"
    ],
    "cat-6": [ // Accessories
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"
    ],
    "cat-7": [ // Loungewear
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800"
    ],
    "cat-8": [ // Activewear
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800",
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=800"
    ],
    "cat-9": [ // Tailoring
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800",
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800"
    ],
    "cat-10": [ // Fine Jewelry
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800"
    ]
  };

  const products: MockProduct[] = [];
  const variants: MockProductVariant[] = [];

  const colors = ["Black", "Camel", "Navy", "Silver", "Ivory"];
  const sizes = ["S", "M", "L", "XL"];

  for (let i = 1; i <= 50; i++) {
    const cat = categories[(i - 1) % categories.length];
    const brand = brands[(i - 1) % brands.length];
    const priceBase = 150 + (i * 12);
    const id = `prod-${i}`;
    const productImages = categoryImagesMap[cat.id] || [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800"
    ];

    const prod: MockProduct = {
      id,
      slug: `${brand.slug}-${cat.slug}-item-${i}`,
      name: `${brand.name} ${cat.name === "Fine Jewelry" ? "Band" : cat.name === "Footwear" ? "Loafer" : "Essential"} ${i}`,
      description: `This is the ultimate premium release of the ${brand.name} ${cat.name}. Engineered for comfort and tailored to perfection using the finest materials. Features water-resistant fibers and reinforced stitching details throughout.`,
      shortDescription: `A high-end, limited-edition ${cat.name} designed in collaboration with ${brand.name}.`,
      featured: i % 7 === 0,
      published: true,
      images: productImages,
      tags: [cat.slug, brand.slug, "luxury", "essential"],
      categoryId: cat.id,
      brandId: brand.id,
      createdAt: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(prod);

    for (let j = 0; j < 3; j++) {
      const color = colors[(i + j) % colors.length];
      const size = sizes[(i + j) % sizes.length];
      const varPrice = priceBase + (j * 15);
      
      variants.push({
        id: `var-${i}-${j}`,
        productId: id,
        color,
        size,
        sku: `AUR-${brand.slug.substring(0, 3).toUpperCase()}-${cat.slug.substring(0, 3).toUpperCase()}-${i}-${color.substring(0, 2).toUpperCase()}-${size}`,
        price: varPrice,
        compareAtPrice: Math.round(varPrice * 1.25),
        stock: Math.floor(Math.random() * 25) + 3,
        images: prod.images
      });
    }
  }

  const users: MockUser[] = [
    { id: "usr-admin", email: "admin@aura.com", name: "AURA Admin", role: "ADMIN", createdAt: new Date().toISOString() }
  ];

  for (let i = 1; i <= 199; i++) {
    users.push({
      id: `usr-${i}`,
      email: `customer${i}@aura.com`,
      name: `Customer Name ${i}`,
      role: "CUSTOMER",
      createdAt: new Date(Date.now() - i * 4 * 60 * 60 * 1000).toISOString()
    });
  }

  const addresses: MockAddress[] = [];
  const cities = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Sialkot", "Multan"];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const city = cities[i % cities.length];
    addresses.push({
      id: `addr-${i}-1`,
      userId: user.id,
      name: user.name || "Default Address",
      line1: `House No ${i + 12}, Street ${i % 5 + 1}, Sector ${i % 3 === 0 ? "A" : "B"}`,
      line2: `Phase ${i % 2 + 1}, DHA`,
      city,
      state: city === "Karachi" ? "Sindh" : city === "Islamabad" ? "Capital Territory" : "Punjab",
      zip: `${40000 + i}`,
      country: "Pakistan",
      isDefault: true
    });
  }

  const orders: MockOrder[] = [];
  const orderItems: MockOrderItem[] = [];
  const orderStatuses: ("PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED")[] = 
    ["DELIVERED", "SHIPPED", "PROCESSING", "PENDING", "CANCELLED"];

  for (let i = 1; i <= 500; i++) {
    const user = users[i % users.length];
    const userAddr = addresses.find(a => a.userId === user.id) || addresses[0];
    const status = i <= 400 ? "DELIVERED" 
                 : i <= 450 ? "SHIPPED" 
                 : i <= 480 ? "PROCESSING" 
                 : i <= 495 ? "PENDING" 
                 : "CANCELLED";

    const numItems = Math.floor(Math.random() * 3) + 1;
    let orderSubtotal = 0;
    const selectedVars: MockProductVariant[] = [];

    for (let k = 0; k < numItems; k++) {
      const v = variants[Math.floor(Math.random() * variants.length)];
      selectedVars.push(v);
      orderSubtotal += v.price * (k + 1);
    }

    const shipping = orderSubtotal > 300 ? 0 : 15;
    const total = orderSubtotal + shipping;
    const orderId = `ord-${i}`;

    orders.push({
      id: orderId,
      userId: user.id,
      status,
      subtotal: orderSubtotal,
      shippingCost: shipping,
      total,
      stripePaymentIntentId: status !== "PENDING" && status !== "CANCELLED" ? `pi_mock_${i}` : null,
      shippingAddressId: userAddr.id,
      createdAt: new Date(Date.now() - (500 - i) * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });

    for (let k = 0; k < selectedVars.length; k++) {
      const v = selectedVars[k];
      orderItems.push({
        id: `item-${i}-${k}`,
        orderId,
        variantId: v.id,
        quantity: k + 1,
        priceAtPurchase: v.price
      });
    }
  }

  const reviews: MockReview[] = [];
  const reviewTitles = ["Absolutely Stunning", "Exceptional Quality", "Premium Fit", "Solid Build", "Good but pricey"];
  const reviewBodies = [
    "The design is top tier. Fits perfectly and looks incredibly clean.",
    "You can feel the luxury. Best purchase of this year, AURA delivers.",
    "Stitching is top notch. Fabric feels soft and breathable. Highly recommend.",
    "Premium texture, but shipping took a day longer than expected. Still 5 stars.",
    "The cost is high but you get what you pay for. Very elegant finish."
  ];

  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const index = i % reviewTitles.length;

    reviews.push({
      id: `rev-${i}`,
      userId: user.id,
      productId: product.id,
      rating: index === 0 || index === 1 || index === 3 ? 5 : 4,
      title: reviewTitles[index],
      body: reviewBodies[index],
      images: [],
      helpfulVotes: Math.floor(Math.random() * 8),
      verified: i % 2 === 0,
      createdAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString()
    });
  }

  const discountCodes: MockDiscountCode[] = [
    { id: "disc-1", code: "AURA20", type: "PERCENTAGE", value: 20.00, maxUses: 1000, usedCount: 150 },
    { id: "disc-2", code: "LUXURY50", type: "FIXED", value: 50.00, maxUses: 500, usedCount: 20 }
  ];

  return {
    brands,
    categories,
    products,
    variants,
    users,
    addresses,
    orders,
    orderItems,
    reviews,
    wishlist: [],
    discountCodes
  };
}

class MockDatabase {
  private data: MockDatabaseSchema;

  constructor() {
    // Ensure the directory exists
    const dir = path.dirname(MOCK_DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(MOCK_DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(MOCK_DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } catch (e) {
        console.error("Failed to parse mock DB, regenerating...", e);
        this.data = generateSeedData();
        this.save();
      }
    } else {
      console.log("No mock DB found, generating seed mock database...");
      this.data = generateSeedData();
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
  }

  // Brands CRUD
  getBrands() { return this.data.brands; }

  // Categories CRUD
  getCategories() { return this.data.categories; }

  // Products CRUD
  getProducts(filter?: { featured?: boolean; categorySlug?: string; query?: string }) {
    let result = [...this.data.products];
    
    if (filter?.featured !== undefined) {
      result = result.filter(p => p.featured === filter.featured);
    }
    
    if (filter?.categorySlug) {
      const cat = this.data.categories.find(c => c.slug === filter.categorySlug);
      if (cat) {
        result = result.filter(p => p.categoryId === cat.id);
      } else {
        return [];
      }
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Attach brands, categories, variants, and reviews
    return result.map(p => this.populateProduct(p));
  }

  getProductBySlug(slug: string) {
    const product = this.data.products.find(p => p.slug === slug);
    return product ? this.populateProduct(product) : null;
  }

  getProductById(id: string) {
    const product = this.data.products.find(p => p.id === id);
    return product ? this.populateProduct(product) : null;
  }

  createProduct(prod: Omit<MockProduct, "id" | "createdAt" | "updatedAt"> & { variants: Omit<MockProductVariant, "id" | "productId">[] }) {
    const id = `prod-${this.data.products.length + 1}`;
    const newProduct: MockProduct = {
      ...prod,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.data.products.push(newProduct);

    // Create variants
    prod.variants.forEach((v, index) => {
      const varId = `var-${newProduct.id}-${index}`;
      this.data.variants.push({
        ...v,
        id: varId,
        productId: id
      });
    });

    this.save();
    return this.populateProduct(newProduct);
  }

  private populateProduct(p: MockProduct): MockProduct {
    const brand = this.data.brands.find(b => b.id === p.brandId);
    const category = this.data.categories.find(c => c.id === p.categoryId);
    const productVariants = this.data.variants.filter(v => v.productId === p.id);
    const productReviews = this.data.reviews.filter(r => r.productId === p.id).map(r => {
      const user = this.data.users.find(u => u.id === r.userId);
      return { ...r, user };
    });

    return {
      ...p,
      brand,
      category,
      variants: productVariants,
      reviews: productReviews
    };
  }

  // Users CRUD
  getUserByEmail(email: string) {
    return this.data.users.find(u => u.email === email) || null;
  }

  createUser(email: string, name?: string, role: "CUSTOMER" | "ADMIN" = "CUSTOMER") {
    const existing = this.getUserByEmail(email);
    if (existing) return existing;

    const user: MockUser = {
      id: `usr-${this.data.users.length + 1}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    };

    this.data.users.push(user);
    this.save();
    return user;
  }

  // Orders CRUD
  getOrders(userId?: string) {
    let result = [...this.data.orders];
    if (userId) {
      result = result.filter(o => o.userId === userId);
    }
    
    // Sort by date desc
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result.map(o => this.populateOrder(o));
  }

  getOrderById(id: string) {
    const order = this.data.orders.find(o => o.id === id);
    return order ? this.populateOrder(order) : null;
  }

  createOrder(orderData: {
    userId?: string | null;
    shippingAddress: Omit<MockAddress, "id" | "userId">;
    items: { variantId: string; quantity: number }[];
    discountCode?: string;
  }) {
    // Save address
    const addrId = `addr-gen-${Date.now()}`;
    const newAddress: MockAddress = {
      ...orderData.shippingAddress,
      id: addrId,
      userId: orderData.userId || "guest"
    };
    this.data.addresses.push(newAddress);

    // Calculate subtotal
    let subtotal = 0;
    const itemsCreated: MockOrderItem[] = [];
    const orderId = `ord-gen-${Date.now()}`;

    orderData.items.forEach((item, index) => {
      const v = this.data.variants.find(variant => variant.id === item.variantId);
      if (v) {
        subtotal += v.price * item.quantity;
        itemsCreated.push({
          id: `item-gen-${orderId}-${index}`,
          orderId,
          variantId: v.id,
          quantity: item.quantity,
          priceAtPurchase: v.price
        });
        
        // Deduct stock
        v.stock = Math.max(0, v.stock - item.quantity);
      }
    });

    // Check discount
    let discount = 0;
    if (orderData.discountCode) {
      const code = this.data.discountCodes.find(d => d.code === orderData.discountCode);
      if (code) {
        if (code.type === "PERCENTAGE") {
          discount = subtotal * (code.value / 100);
        } else {
          discount = code.value;
        }
        code.usedCount += 1;
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const shipping = subtotalAfterDiscount > 300 ? 0 : 15;
    const total = subtotalAfterDiscount + shipping;

    const newOrder: MockOrder = {
      id: orderId,
      userId: orderData.userId,
      status: "PROCESSING",
      subtotal: subtotalAfterDiscount,
      shippingCost: shipping,
      total,
      stripePaymentIntentId: `pi_mock_${Date.now()}`,
      shippingAddressId: addrId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.orders.push(newOrder);
    this.data.orderItems.push(...itemsCreated);
    
    this.save();
    return this.populateOrder(newOrder);
  }

  updateOrderStatus(orderId: string, status: MockOrder["status"]) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.save();
      return this.populateOrder(order);
    }
    return null;
  }

  private populateOrder(o: MockOrder): MockOrder {
    const items = this.data.orderItems.filter(item => item.orderId === o.id).map(item => {
      const variant = this.data.variants.find(v => v.id === item.variantId);
      let populatedVariant = variant ? { ...variant } : undefined;
      
      if (populatedVariant) {
        const prod = this.data.products.find(p => p.id === populatedVariant!.productId);
        populatedVariant = { ...populatedVariant, name: prod?.name } as any;
      }
      
      return { ...item, variant: populatedVariant };
    });

    const shippingAddress = this.data.addresses.find(a => a.id === o.shippingAddressId);
    const user = this.data.users.find(u => u.id === o.userId) || null;

    return {
      ...o,
      items,
      shippingAddress,
      user
    };
  }

  // Reviews CRUD
  createReview(reviewData: Omit<MockReview, "id" | "createdAt" | "helpfulVotes">) {
    const id = `rev-gen-${Date.now()}`;
    const newReview: MockReview = {
      ...reviewData,
      id,
      helpfulVotes: 0,
      createdAt: new Date().toISOString()
    };
    
    this.data.reviews.push(newReview);
    this.save();
    return newReview;
  }

  // Wishlist CRUD
  getWishlist(userId: string) {
    const items = this.data.wishlist.filter(w => w.userId === userId);
    return items.map(w => {
      const variant = this.data.variants.find(v => v.id === w.variantId);
      let populatedVariant = variant ? { ...variant } : undefined;
      
      if (populatedVariant) {
        const prod = this.data.products.find(p => p.id === populatedVariant!.productId);
        populatedVariant = { ...populatedVariant, name: prod?.name } as any;
      }
      
      return { ...w, variant: populatedVariant };
    });
  }

  addToWishlist(userId: string, variantId: string) {
    const exists = this.data.wishlist.some(w => w.userId === userId && w.variantId === variantId);
    if (exists) return { success: true };

    this.data.wishlist.push({
      id: `wish-${Date.now()}`,
      userId,
      variantId,
      addedAt: new Date().toISOString()
    });
    
    this.save();
    return { success: true };
  }

  removeFromWishlist(userId: string, variantId: string) {
    this.data.wishlist = this.data.wishlist.filter(w => !(w.userId === userId && w.variantId === variantId));
    this.save();
    return { success: true };
  }

  // Discounts
  getDiscountCode(code: string) {
    const dc = this.data.discountCodes.find(d => d.code.toUpperCase() === code.toUpperCase());
    if (!dc) return null;
    
    // Check if expired
    if (dc.expiresAt && new Date(dc.expiresAt).getTime() < Date.now()) {
      return null;
    }
    
    // Check uses
    if (dc.usedCount >= dc.maxUses) {
      return null;
    }

    return dc;
  }

  // Analytics API
  getAnalyticsData() {
    const totalOrders = this.data.orders.length;
    const completedOrders = this.data.orders.filter(o => o.status === "DELIVERED" || o.status === "SHIPPED");
    
    const revenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const conversionRate = 3.25; // fixed mock metric
    const totalCustomers = this.data.users.filter(u => u.role === "CUSTOMER").length;

    // Daily revenue over the last 15 days
    const dailyRevenue: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      const dayOrders = this.data.orders.filter(o => {
        const oDate = new Date(o.createdAt);
        return oDate.getFullYear() === d.getFullYear() &&
               oDate.getMonth() === d.getMonth() &&
               oDate.getDate() === d.getDate() &&
               (o.status === "DELIVERED" || o.status === "SHIPPED" || o.status === "PROCESSING");
      });

      const dayRev = dayOrders.reduce((sum, o) => sum + Number(o.total), 0);
      
      dailyRevenue.push({
        date: dateStr,
        revenue: Math.round(dayRev),
        orders: dayOrders.length
      });
    }

    // Top products by orders
    const variantSalesMap: Record<string, number> = {};
    this.data.orderItems.forEach(item => {
      variantSalesMap[item.variantId] = (variantSalesMap[item.variantId] || 0) + item.quantity;
    });

    const topProducts = Object.entries(variantSalesMap)
      .map(([variantId, quantity]) => {
        const v = this.data.variants.find(variant => variant.id === variantId);
        const p = v ? this.data.products.find(prod => prod.id === v.productId) : null;
        return {
          id: p?.id || "unknown",
          name: p?.name || "Product",
          slug: p?.slug || "",
          sales: quantity,
          revenue: Math.round(quantity * (v ? Number(v.price) : 0))
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      revenue,
      ordersCount: totalOrders,
      customersCount: totalCustomers,
      conversionRate,
      dailyRevenue,
      topProducts
    };
  }
}

// Global Singleton
let mockDbInstance: MockDatabase;

export function getMockDb() {
  if (!mockDbInstance) {
    mockDbInstance = new MockDatabase();
  }
  return mockDbInstance;
}
