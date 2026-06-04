import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/db/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "ADMIN";
    } & DefaultSession["user"]
  }
  interface User {
    role?: "CUSTOMER" | "ADMIN";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "dummy-google-id",
      clientSecret: process.env.GOOGLE_SECRET || "dummy-google-secret",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "dummy-github-id",
      clientSecret: process.env.GITHUB_SECRET || "dummy-github-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        try {
          // Check database for user
          let user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          // Create mock user if they don't exist yet and it's a dev flow
          if (!user && process.env.NODE_ENV !== "production") {
            const isFirstUser = (await prisma.user.count()) === 0;
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                name: (credentials.email as string).split("@")[0],
                role: isFirstUser ? "ADMIN" : "CUSTOMER",
              },
            });
          }

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image,
            };
          }
        } catch (error) {
          console.error("Auth authorize error:", error);
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "CUSTOMER" | "ADMIN") || "CUSTOMER";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-at-least-32-chars-long",
});
