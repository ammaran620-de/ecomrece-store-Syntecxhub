import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { items, customerDetails } = await req.json();

    // In a real app, we validate items against the database to get accurate prices
    // and prevent tampering on the client side.
    const productIds = items.map((item: any) => item.id);
    /* 
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    // Calculate total from dbProducts...
    */
    
    // For this prototype, we trust the client total (DO NOT do this in production)
    const amount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // orderId could be created in DB here as PENDING and attached
        customerEmail: customerDetails?.email || "guest@example.com",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
