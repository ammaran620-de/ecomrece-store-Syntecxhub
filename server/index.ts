import { router } from './trpc';
import { productsRouter } from './routers/products';

export const appRouter = router({
  products: productsRouter,
  // Add other routers here (users, orders, analytics)
});

export type AppRouter = typeof appRouter;
