import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ success: false, error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err)
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    console.log("[Webhook] Received event:", event.type)

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute
        await handleDispute(dispute)
        break
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    console.error("[Webhook] Error:", error)
    return NextResponse.json({ success: false, error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderNumber = paymentIntent.metadata.order_number

    console.log("[Webhook] Payment succeeded for order:", orderNumber)

    // TODO: Update order status to "paid" in database
    // TODO: Decrement inventory
    // TODO: Send confirmation email
    // TODO: Create inventory transactions

    // Example database update:
    /*
    await query(
      `UPDATE orders 
       SET status = 'paid', updated_at = NOW() 
       WHERE payment_id = $1`,
      [paymentIntent.id]
    )
    */

    console.log("[Webhook] Order updated successfully:", orderNumber)
  } catch (error) {
    console.error("[Webhook] Failed to handle payment success:", error)
    throw error
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderNumber = paymentIntent.metadata.order_number

    console.log("[Webhook] Payment failed for order:", orderNumber)

    // TODO: Update order status to "failed" in database
    // TODO: Release any reserved inventory
    // TODO: Send failure notification email

    console.log("[Webhook] Payment failure handled:", orderNumber)
  } catch (error) {
    console.error("[Webhook] Failed to handle payment failure:", error)
    throw error
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  try {
    console.log("[Webhook] Dispute created:", dispute.id)

    // TODO: Update order status to "disputed"
    // TODO: Send notification to admin
    // TODO: Log dispute details

    console.log("[Webhook] Dispute handled:", dispute.id)
  } catch (error) {
    console.error("[Webhook] Failed to handle dispute:", error)
    throw error
  }
}
