import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { generateOrderNumber } from "@/lib/utils"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "usd", billing_address, shipping_address, items, shipping_method, coupon_code } = body

    if (!amount || amount < 50) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 })
    }

    if (!billing_address?.email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_number: orderNumber,
        items_count: items.length.toString(),
        shipping_method,
        coupon_code: coupon_code || "",
      },
      shipping: {
        name: `${shipping_address.first_name} ${shipping_address.last_name}`,
        address: {
          line1: shipping_address.address_line_1,
          line2: shipping_address.address_line_2 || undefined,
          city: shipping_address.city,
          state: shipping_address.state || undefined,
          postal_code: shipping_address.postal_code,
          country: shipping_address.country,
        },
        phone: shipping_address.phone || undefined,
      },
      receipt_email: billing_address.email,
    })

    // Store order in database with "created" status
    // This will be updated to "paid" via webhook
    const orderData = {
      order_number: orderNumber,
      email: billing_address.email,
      billing_address_json: billing_address,
      shipping_address_json: shipping_address,
      items_json: items,
      subtotal_cents: items.reduce((sum: number, item: any) => sum + item.price_cents * item.quantity, 0),
      shipping_cents: 1500, // This should be calculated based on shipping_method
      tax_cents: Math.round(amount * 0.0875), // This should be calculated properly
      discount_cents: 0, // This should be calculated from coupon
      total_cents: amount,
      currency: currency.toUpperCase(),
      status: "created",
      payment_gateway: "stripe",
      payment_id: paymentIntent.id,
      shipping_method,
    }

    // TODO: Insert order into database
    console.log("[Payment Intent] Order data prepared:", orderData)

    return NextResponse.json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        order_number: orderNumber,
      },
    })
  } catch (error) {
    console.error("[Payment Intent] Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create payment intent" }, { status: 500 })
  }
}
