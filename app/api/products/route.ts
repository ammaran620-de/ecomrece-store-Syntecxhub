import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().nonnegative(),
  categoryId: z.string(),
  brandId: z.string(),
  images: z.array(z.string()).default([]),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const categorySlug = searchParams.get("category");

    const whereClause: any = {};
    if (featured) whereClause.featured = true;
    if (categorySlug) {
      whereClause.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        brand: true,
        variants: true,
      },
    });

    return NextResponse.json({
      data: products,
      error: null,
      meta: { count: products.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || "Failed to fetch products", meta: null },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createProductSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { data: null, error: validation.error.format(), meta: null },
        { status: 400 }
      );
    }

    const { name, slug, description, shortDescription, price, stock, categoryId, brandId, images } = validation.data;

    // Call prisma proxy (will auto fallback to mockDb if offline)
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        categoryId,
        brandId,
        images,
        variants: {
          create: [
            { color: "Black", size: "M", sku: `SYN-${slug.substring(0,3).toUpperCase()}-BLK-M`, price, stock, images }
          ]
        }
      } as any
    });

    return NextResponse.json({ data: product, error: null, meta: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || "Failed to create product", meta: null },
      { status: 500 }
    );
  }
}
