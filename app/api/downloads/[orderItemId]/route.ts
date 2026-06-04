import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { orderItemId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderItemId } = params;
    
    // For prototype purposes, return a secure mock download link
    const signedUrl = `https://aura.co/files/download-${orderItemId}.pdf?token=mock_expiry_signature`;

    return NextResponse.json({ downloadUrl: signedUrl });
  } catch (error: any) {
    console.error("Download URL generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
