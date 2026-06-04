import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    let event: any = { type: "payment_intent.succeeded", data: { object: { id: "mock_pi", metadata: { email: "customer@aura.com" } } } };

    if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== "whsec_dummy") {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Find order in DB (mock proxy will handle local storage)
      const order = await prisma.order.findUnique({
        where: { stripePaymentIntentId: paymentIntentId }
      } as any);

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "PROCESSING" }
        } as any);
        console.log(`Order ${order.id} status updated to PROCESSING on payment completion.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Webhook handling crashed" },
      { status: 500 }
    );
  }
}
