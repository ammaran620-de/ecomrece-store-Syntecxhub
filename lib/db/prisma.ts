import { PrismaClient } from "@prisma/client";
import { getMockDb } from "./mockDb";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const realPrisma = globalThis.prismaGlobal ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = realPrisma;

// Check if database is reachable.
let isDatabaseAvailable = false;
let databaseChecked = false;

async function checkDatabaseConnection() {
  if (databaseChecked) return isDatabaseAvailable;
  try {
    // Run a fast raw query to test connectivity
    await Promise.race([
      realPrisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))
    ]);
    isDatabaseAvailable = true;
    console.log("Database connection successful. Running in PostgreSQL mode.");
  } catch (error) {
    isDatabaseAvailable = false;
    console.warn("Database connection failed. Falling back to Mock DB mode (lib/db/mockDb.json).");
  }
  databaseChecked = true;
  return isDatabaseAvailable;
}

// Emulate Prisma queries using MockDB
const mockPrismaHandler = {
  get(target: any, modelName: string) {
    if (modelName === "$connect" || modelName === "$disconnect") {
      return async () => {};
    }
    if (modelName === "$transaction") {
      return async (actions: Promise<any>[]) => Promise.all(actions);
    }
    
    return {
      findMany: async (args?: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].findMany(args);
        
        const mockDb = getMockDb();
        if (modelName === "product") {
          const featured = args?.where?.featured;
          const categorySlug = args?.where?.category?.slug;
          return mockDb.getProducts({ featured, categorySlug });
        }
        if (modelName === "category") {
          return mockDb.getCategories();
        }
        if (modelName === "brand") {
          return mockDb.getBrands();
        }
        if (modelName === "order") {
          const userId = args?.where?.userId;
          return mockDb.getOrders(userId);
        }
        if (modelName === "review") {
          return mockDb.getAnalyticsData(); // or reviews
        }
        return [];
      },
      findUnique: async (args: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].findUnique(args);
        
        const mockDb = getMockDb();
        const value = args?.where?.slug || args?.where?.id || args?.where?.email;
        if (modelName === "product") {
          return args?.where?.slug ? mockDb.getProductBySlug(value) : mockDb.getProductById(value);
        }
        if (modelName === "user") {
          return mockDb.getUserByEmail(value);
        }
        if (modelName === "order") {
          return mockDb.getOrderById(value);
        }
        if (modelName === "discountCode") {
          return mockDb.getDiscountCode(args?.where?.code);
        }
        return null;
      },
      findFirst: async (args: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].findFirst(args);
        
        // Emulate findFirst as findUnique where possible
        const mockDb = getMockDb();
        const email = args?.where?.email;
        if (modelName === "user" && email) {
          return mockDb.getUserByEmail(email);
        }
        return null;
      },
      create: async (args: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].create(args);
        
        const mockDb = getMockDb();
        const data = args?.data;
        if (modelName === "order") {
          const items = data?.items?.createMany?.data || data?.items?.create || [];
          const shippingAddress = data?.shippingAddress || data?.shippingAddress?.create || {};
          return mockDb.createOrder({
            userId: data?.userId,
            shippingAddress,
            items: items.map((i: any) => ({ variantId: i.variantId, quantity: i.quantity })),
            discountCode: args?.discountCode
          });
        }
        if (modelName === "user") {
          return mockDb.createUser(data.email, data.name, data.role);
        }
        if (modelName === "review") {
          return mockDb.createReview(data);
        }
        if (modelName === "product") {
          return mockDb.createProduct(data);
        }
        return data;
      },
      update: async (args: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].update(args);
        
        const mockDb = getMockDb();
        if (modelName === "order") {
          return mockDb.updateOrderStatus(args.where.id, args.data.status);
        }
        return args?.data;
      },
      delete: async (args: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].delete(args);
        return { success: true };
      },
      count: async (args?: any) => {
        await checkDatabaseConnection();
        if (isDatabaseAvailable) return realPrisma[modelName].count(args);
        
        const mockDb = getMockDb();
        if (modelName === "product") return mockDb.getProducts().length;
        if (modelName === "user") return 200;
        if (modelName === "order") return 500;
        return 0;
      }
    };
  }
};

const prisma = new Proxy(realPrisma, mockPrismaHandler);

// Background check
checkDatabaseConnection();

export default prisma;
export { realPrisma };
