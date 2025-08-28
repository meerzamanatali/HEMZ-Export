// Email templates for HEMZ Pashmina e-commerce notifications

import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/lib/types/ecommerce"

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function orderConfirmationTemplate(order: any): EmailTemplate {
  const itemsHtml = order.items_json
    .map(
      (item: CartItem) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #1f2937;">${item.product_title}</div>
        <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">
          ${Object.entries(item.variant_attributes)
            .map(([key, value]) => `${key}: ${value}`)
            .join(" • ")}
        </div>
        <div style="font-size: 14px; color: #6b7280;">SKU: ${item.variant_sku}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${formatPrice(item.price_cents * item.quantity)}
      </td>
    </tr>
  `,
    )
    .join("")

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - HEMZ Pashmina</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #c79a6a;">
    <h1 style="font-family: 'Playfair Display', serif; color: #c79a6a; font-size: 32px; margin: 0;">HEMZ</h1>
    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0;">Pashmina</p>
  </div>

  <!-- Order Confirmation -->
  <div style="background: #f8f6f4; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
    <h2 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 24px; margin: 0 0 15px 0;">
      Order Confirmed!
    </h2>
    <p style="color: #6b7280; margin: 0 0 20px 0;">
      Thank you for your order. We've received your payment and will begin processing your items shortly.
    </p>
    <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #c79a6a;">
      <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Order Number</div>
      <div style="font-size: 18px; font-weight: 600; color: #1f2937;">${order.order_number}</div>
    </div>
  </div>

  <!-- Order Items -->
  <div style="margin-bottom: 30px;">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 20px; margin: 0 0 20px 0;">
      Order Details
    </h3>
    <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 15px; text-align: left; font-weight: 600; color: #374151;">Item</th>
          <th style="padding: 15px; text-align: center; font-weight: 600; color: #374151;">Qty</th>
          <th style="padding: 15px; text-align: right; font-weight: 600; color: #374151;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
  </div>

  <!-- Order Summary -->
  <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 18px; margin: 0 0 20px 0;">
      Order Summary
    </h3>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span>Subtotal:</span>
      <span>${formatPrice(order.subtotal_cents)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span>Shipping:</span>
      <span>${formatPrice(order.shipping_cents)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
      <span>Tax:</span>
      <span>${formatPrice(order.tax_cents)}</span>
    </div>
    <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 600;">
      <span>Total:</span>
      <span style="color: #c79a6a;">${formatPrice(order.total_cents)}</span>
    </div>
  </div>

  <!-- Shipping Address -->
  <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
      Shipping Address
    </h3>
    <div style="color: #6b7280; line-height: 1.5;">
      ${order.shipping_address_json.first_name} ${order.shipping_address_json.last_name}<br>
      ${order.shipping_address_json.company ? `${order.shipping_address_json.company}<br>` : ""}
      ${order.shipping_address_json.address_line_1}<br>
      ${order.shipping_address_json.address_line_2 ? `${order.shipping_address_json.address_line_2}<br>` : ""}
      ${order.shipping_address_json.city}, ${order.shipping_address_json.state} ${order.shipping_address_json.postal_code}<br>
      ${order.shipping_address_json.country}
    </div>
  </div>

  <!-- What's Next -->
  <div style="background: #f8f6f4; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
      What's Next?
    </h3>
    <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">We'll process your order within 1-2 business days</li>
      <li style="margin-bottom: 8px;">You'll receive a shipping confirmation with tracking information</li>
      <li style="margin-bottom: 8px;">Your luxury textiles will be carefully packaged and shipped</li>
      <li>Expected delivery: 7-14 business days for international orders</li>
    </ul>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p style="margin: 0 0 10px 0;">
      Questions about your order? 
      <a href="mailto:orders@hemzpashmina.com" style="color: #c79a6a; text-decoration: none;">Contact our support team</a>
    </p>
    <p style="margin: 0;">
      HEMZ Pashmina - Exquisite Handwoven Textiles from Kashmir
    </p>
  </div>

</body>
</html>
  `

  const text = `
HEMZ PASHMINA - ORDER CONFIRMATION

Order Number: ${order.order_number}

Thank you for your order! We've received your payment and will begin processing your items shortly.

ORDER DETAILS:
${order.items_json
  .map(
    (item: CartItem) =>
      `- ${item.product_title} (${Object.entries(item.variant_attributes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")}) x${item.quantity} - ${formatPrice(item.price_cents * item.quantity)}`,
  )
  .join("\n")}

ORDER SUMMARY:
Subtotal: ${formatPrice(order.subtotal_cents)}
Shipping: ${formatPrice(order.shipping_cents)}
Tax: ${formatPrice(order.tax_cents)}
Total: ${formatPrice(order.total_cents)}

SHIPPING ADDRESS:
${order.shipping_address_json.first_name} ${order.shipping_address_json.last_name}
${order.shipping_address_json.company ? `${order.shipping_address_json.company}\n` : ""}${order.shipping_address_json.address_line_1}
${order.shipping_address_json.address_line_2 ? `${order.shipping_address_json.address_line_2}\n` : ""}${order.shipping_address_json.city}, ${order.shipping_address_json.state} ${order.shipping_address_json.postal_code}
${order.shipping_address_json.country}

WHAT'S NEXT:
- We'll process your order within 1-2 business days
- You'll receive shipping confirmation with tracking information
- Expected delivery: 7-14 business days for international orders

Questions? Contact us at orders@hemzpashmina.com

HEMZ Pashmina - Exquisite Handwoven Textiles from Kashmir
  `

  return {
    subject: `Order Confirmation - ${order.order_number} - HEMZ Pashmina`,
    html,
    text,
  }
}

export function shippingConfirmationTemplate(order: any, trackingNumber: string): EmailTemplate {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order Has Shipped - HEMZ Pashmina</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #c79a6a;">
    <h1 style="font-family: 'Playfair Display', serif; color: #c79a6a; font-size: 32px; margin: 0;">HEMZ</h1>
    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0;">Pashmina</p>
  </div>

  <!-- Shipping Confirmation -->
  <div style="background: #f0f9ff; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #0ea5e9;">
    <h2 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 24px; margin: 0 0 15px 0;">
      Your Order Has Shipped! 📦
    </h2>
    <p style="color: #6b7280; margin: 0 0 20px 0;">
      Great news! Your luxury textiles are on their way to you.
    </p>
    <div style="background: white; padding: 20px; border-radius: 6px;">
      <div style="margin-bottom: 15px;">
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Order Number</div>
        <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${order.order_number}</div>
      </div>
      <div>
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Tracking Number</div>
        <div style="font-size: 16px; font-weight: 600; color: #0ea5e9; font-family: monospace;">${trackingNumber}</div>
      </div>
    </div>
  </div>

  <!-- Tracking Info -->
  <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
      Track Your Package
    </h3>
    <p style="color: #6b7280; margin: 0 0 20px 0;">
      Use the tracking number above to monitor your shipment's progress. Updates typically appear within 24 hours.
    </p>
    <div style="text-align: center;">
      <a href="#" style="display: inline-block; background: #c79a6a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Track Your Order
      </a>
    </div>
  </div>

  <!-- Delivery Info -->
  <div style="background: #f8f6f4; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
      Delivery Information
    </h3>
    <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Estimated delivery: 7-14 business days</li>
      <li style="margin-bottom: 8px;">Signature may be required upon delivery</li>
      <li style="margin-bottom: 8px;">Package will be carefully wrapped to protect your textiles</li>
      <li>Contact us immediately if there are any delivery issues</li>
    </ul>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p style="margin: 0 0 10px 0;">
      Questions about your shipment? 
      <a href="mailto:orders@hemzpashmina.com" style="color: #c79a6a; text-decoration: none;">Contact our support team</a>
    </p>
    <p style="margin: 0;">
      HEMZ Pashmina - Exquisite Handwoven Textiles from Kashmir
    </p>
  </div>

</body>
</html>
  `

  const text = `
HEMZ PASHMINA - YOUR ORDER HAS SHIPPED

Order Number: ${order.order_number}
Tracking Number: ${trackingNumber}

Great news! Your luxury textiles are on their way to you.

DELIVERY INFORMATION:
- Estimated delivery: 7-14 business days
- Signature may be required upon delivery
- Package will be carefully wrapped to protect your textiles
- Contact us immediately if there are any delivery issues

Use your tracking number to monitor your shipment's progress. Updates typically appear within 24 hours.

Questions about your shipment? Contact us at orders@hemzpashmina.com

HEMZ Pashmina - Exquisite Handwoven Textiles from Kashmir
  `

  return {
    subject: `Your Order Has Shipped - ${order.order_number} - HEMZ Pashmina`,
    html,
    text,
  }
}

export function paymentFailedTemplate(order: any): EmailTemplate {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Issue - HEMZ Pashmina</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #c79a6a;">
    <h1 style="font-family: 'Playfair Display', serif; color: #c79a6a; font-size: 32px; margin: 0;">HEMZ</h1>
    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0 0 0;">Pashmina</p>
  </div>

  <!-- Payment Issue -->
  <div style="background: #fef2f2; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ef4444;">
    <h2 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 24px; margin: 0 0 15px 0;">
      Payment Issue with Your Order
    </h2>
    <p style="color: #6b7280; margin: 0 0 20px 0;">
      We encountered an issue processing your payment for order ${order.order_number}. Don't worry - your items are still reserved.
    </p>
    <div style="background: white; padding: 20px; border-radius: 6px;">
      <div style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Order Number</div>
      <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${order.order_number}</div>
    </div>
  </div>

  <!-- Next Steps -->
  <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h3 style="font-family: 'Playfair Display', serif; color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">
      What You Can Do
    </h3>
    <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Check that your payment method has sufficient funds</li>
      <li style="margin-bottom: 8px;">Verify your billing address matches your payment method</li>
      <li style="margin-bottom: 8px;">Try a different payment method</li>
      <li>Contact your bank if the issue persists</li>
    </ul>
    <div style="text-align: center; margin-top: 20px;">
      <a href="#" style="display: inline-block; background: #c79a6a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Retry Payment
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p style="margin: 0 0 10px 0;">
      Need help? 
      <a href="mailto:orders@hemzpashmina.com" style="color: #c79a6a; text-decoration: none;">Contact our support team</a>
    </p>
    <p style="margin: 0;">
      HEMZ Pashmina - Exquisite Handwoven Textiles from Kashmir
    </p>
  </div>

</body>
</html>
  `

  const text = `
HEMZ PASHMINA - PAYMENT ISSUE

Order Number: ${order.order_number}

We encountered an issue processing your payment. Don't worry - your items are still reserved.

WHAT YOU CAN DO:
- Check that your payment method has sufficient funds
- Verify your billing address matches your payment method
- Try a different payment method
- Contact your bank if the issue persists

You can retry your payment by visiting your order page or contacting our support team.

Need help? Contact us at orders@hemzpashmina.com

HEMZ Pashmina - Exquisite Handwoven Textiles from Kashmir
  `

  return {
    subject: `Payment Issue - Order ${order.order_number} - HEMZ Pashmina`,
    html,
    text,
  }
}
