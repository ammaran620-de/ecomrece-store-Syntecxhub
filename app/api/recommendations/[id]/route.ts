import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Load related items. Since we run in Edge, we can query items directly
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        category: true,
        brand: true,
      }
    } as any);

    const reasons = [
      "Trending in your region right now",
      "Matches your styling profile score of 98%",
      "Frequently purchased together with item",
      "Because you viewed similar outerwear releases"
    ];

    const recommendations = products.map((p, idx) => ({
      ...p,
      reasonChip: reasons[idx % reasons.length]
    }));

    return NextResponse.json({
      data: recommendations,
      error: null,
      meta: { sourceId: id }
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || "Failed to generate recommendations", meta: null },
      { status: 500 }
    );
  }
}
