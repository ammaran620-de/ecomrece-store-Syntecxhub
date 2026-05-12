import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as any;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Update order status in DB
      /*
      await prisma.order.update({
        where: { paymentIntentId: paymentIntent.id },
        data: { status: 'CONFIRMED' },
      });
      */
      break;
      
    case "charge.dispute.created":
      const dispute = event.data.object as any;
      console.warn(`Dispute created for charge ${dispute.charge}`);
      break;
      
    case "refund.created":
      const refund = event.data.object as any;
      console.log(`Refund created for ${refund.amount}`);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new NextResponse(null, { status: 200 });
}
