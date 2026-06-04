import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const { 
      email, 
      name, 
      phone, 
      addressLine1, 
      city, 
      zip, 
      items, 
      paymentMethod, 
      shippingMethod, 
      packagingOpt,
      discountCode 
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Empty cart items" }, { status: 400 });
    }

    // Find or create guest user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "Guest Customer",
          role: "CUSTOMER"
        }
      });
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

    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const shipping = shippingMethod === "express" ? 15 : (subtotalAfterDiscount > 300 ? 0 : 15);
    const packaging = packagingOpt ? 15 : 0;
    const total = subtotalAfterDiscount + shipping + packaging;

    // Create the order using Prisma
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PROCESSING",
        subtotal: subtotalAfterDiscount,
        shippingCost: shipping,
        total,
        stripePaymentIntentId: paymentMethod === "CARD" ? `pi_mock_${Date.now()}` : "COD",
        shippingAddress: {
          create: {
            userId: user.id,
            name: name || "Default Address",
            line1: addressLine1,
            line2: `Phone: ${phone}`,
            city,
            state: "Punjab", // default state
            zip,
            country: "Pakistan",
            isDefault: false
          }
        },
        items: {
          create: items.map((i: any) => ({
            variantId: i.id,
            quantity: i.quantity,
            priceAtPurchase: i.price
          }))
        }
      }
    } as any);

    return NextResponse.json({ order, success: true });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
