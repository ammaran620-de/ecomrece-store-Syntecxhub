import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    } as any);

    if (!product) {
      return NextResponse.json(
        { data: null, error: "Product not found", meta: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product, error: null, meta: null });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || "Failed to fetch product", meta: null },
      { status: 500 }
    );
  }
}
