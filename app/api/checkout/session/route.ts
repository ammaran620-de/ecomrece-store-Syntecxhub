import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { items, address, email, discountCode } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ data: null, error: "Empty cart items list", meta: null }, { status: 400 });
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    // Process discount
    let discount = 0;
    if (discountCode) {
      const code = await prisma.discountCode.findUnique({ where: { code: discountCode } });
      if (code) {
        if (code.type === "PERCENTAGE") {
          discount = subtotal * (Number(code.value) / 100);
        } else {
          discount = Number(code.value);
        }
      }
    }

    const total = Math.max(0, subtotal - discount) + 15; // subtotal - disc + shipping

    let clientSecret = "mock_client_secret_gen_" + Date.now();
    let paymentIntentId = "pi_mock_id_gen_" + Date.now();

    // If Stripe secret is configured, call actual Stripe SDK
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_dummy") {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // stripe expects cents
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          metadata: { email, discountCode: discountCode || "none" }
        });
        clientSecret = paymentIntent.client_secret || clientSecret;
        paymentIntentId = paymentIntent.id || paymentIntentId;
      } catch (stripeErr) {
        console.warn("Stripe API error, proceeding in mock mode:", stripeErr);
      }
    }

    return NextResponse.json({
      data: {
        clientSecret,
        paymentIntentId,
        totalBilling: total,
      },
      error: null,
      meta: null
    });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message || "Failed to create checkout session", meta: null },
      { status: 500 }
    );
  }
}
