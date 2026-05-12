import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db/prisma";

// Context for tRPC
export const createContext = async () => {
  const session = await getServerSession(authOptions);
  return {
    session,
    prisma,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Reusable middleware for protecting routes
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user || (ctx.session.user as any).role !== 'ADMIN' && (ctx.session.user as any).role !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const adminProcedure = t.procedure.use(isAdmin);
