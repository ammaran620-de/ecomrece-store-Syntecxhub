import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ data: [], error: null, meta: null });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { shortDescription: { contains: query, mode: "insensitive" } },
        ]
      } as any,
      include: {
        category: true,
        brand: true,
      }
    });

    return NextResponse.json({
      data: products,
      error: null,
      meta: { query, count: products.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || "Failed to execute search", meta: null },
      { status: 500 }
    );
  }
}
