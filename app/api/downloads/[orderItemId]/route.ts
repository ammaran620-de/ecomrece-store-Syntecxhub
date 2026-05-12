import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateSignedDownloadUrl } from "@/lib/s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { orderItemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderItemId } = params;

    // Verify the user owns the order item
    /*
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true,
        product: true
      }
    });

    if (!orderItem || orderItem.order.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    if (!orderItem.isDigital || !orderItem.downloadUrl) {
      return NextResponse.json({ error: "Item is not a digital download" }, { status: 400 });
    }

    // In this mock, we assume downloadUrl holds the S3 object key
    const s3Key = orderItem.downloadUrl;
    */
    
    // For prototype purposes:
    const mockS3Key = `digital-products/item-${orderItemId}.pdf`;
    
    // Generate a URL that expires in 24 hours (1440 minutes)
    const signedUrl = generateSignedDownloadUrl(mockS3Key, 1440);

    return NextResponse.json({ downloadUrl: signedUrl });
  } catch (error: any) {
    console.error("Download URL generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
