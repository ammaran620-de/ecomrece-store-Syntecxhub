import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";

export const productsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().nullish(), // for infinite scrolling
        categoryId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      /*
      const items = await ctx.prisma.product.findMany({
        take: input.limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          categoryId: input.categoryId,
          status: "ACTIVE"
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      */
      
      // Mock return for prototype
      const mockItems = [
        { id: "1", name: "The Essential Overcoat", price: 495 },
        { id: "2", name: "Silk Crepe Blouse", price: 225 },
      ];
      
      return {
        items: mockItems,
        nextCursor: null, // would be items[limit].id in real implementation
      };
    }),
    
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      /*
      return ctx.prisma.product.create({
        data: {
          name: input.name,
          slug: input.name.toLowerCase().replace(/ /g, '-'),
          price: input.price,
          description: input.description,
        }
      });
      */
      return { id: "new-id", ...input };
    }),
});
