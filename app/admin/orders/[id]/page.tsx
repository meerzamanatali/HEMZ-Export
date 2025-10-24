"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, CreditCard, User, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Mock order data
const order = {
  id: "HEMZ-001",
  order_number: "HEMZ-001",
  status: "paid",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:35:00Z",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
  },
  billing_address: {
    first_name: "John",
    last_name: "Doe",
    company: "Doe Enterprises",
    address_line_1: "123 Main St",
    address_line_2: "Suite 100",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "US",
  },
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    company: "Doe Enterprises",
    address_line_1: "123 Main St",
    address_line_2: "Suite 100",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "US",
  },
  items: [
    {
      id: 1,
      product_title: "Kashmiri Cashmere Shawl - Ivory",
      variant_sku: "CSH-001-IV-70x200",
      variant_attributes: { color: "Ivory", size: "70x200cm" },
      quantity: 1,
      price_cents: 9500,
    },
    {
      id: 2,
      product_title: "Premium Pashmina Scarf - Burgundy",
      variant_sku: "PSC-002-BU-60x180",
      variant_attributes: { color: "Burgundy", size: "60x180cm" },
      quantity: 2,
      price_cents: 7500,
    },
  ],
  subtotal_cents: 24500,
  shipping_cents: 1500,
  tax_cents: 2275,
  total_cents: 28275,
  currency: "USD",
  payment_gateway: "stripe",
  payment_id: "pi_1234567890",
  shipping_method: "standard",
  tracking_number: "",
  notes: "",
}

const statusOptions = [
  { value: "created", label: "Created" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [orderStatus, setOrderStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number)
  const [notes, setNotes] = useState(order.notes)
  const { toast } = useToast()

  const handleUpdateOrder = async () => {
    try {
      // TODO: Implement API call to update order
      console.log("Updating order:", {
        status: orderStatus,
        tracking_number: trackingNumber,
        notes,
      })

      toast({
        title: "Order updated",
        description: "Order has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive",
      })
    }
  }

  const handleRefund = async () => {
    try {
      // TODO: Implement refund logic
      console.log("Processing refund for order:", order.id)

      toast({
        title: "Refund processed",
        description: "Refund has been initiated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process refund.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-bold">Order {order.order_number}</h1>
            <p className="text-muted-foreground">Created on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefund}>
            Process Refund
          </Button>
          <Button onClick={handleUpdateOrder}>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {Object.entries(item.variant_attributes)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(" • ")}
                      </p>
                      <p className="text-sm text-muted-foreground">SKU: {item.variant_sku}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price_cents * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price_cents)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal_cents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_cents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax_cents)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total_cents)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Contact Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Billing Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {order.billing_address.first_name} {order.billing_address.last_name}
                    </p>
                    {order.billing_address.company && <p>{order.billing_address.company}</p>}
                    <p>{order.billing_address.address_line_1}</p>
                    {order.billing_address.address_line_2 && <p>{order.billing_address.address_line_2}</p>}
                    <p>
                      {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
                    </p>
                    <p>{order.billing_address.country}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <div className="text-sm text-muted-foreground">
                  <p>
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                  <p>{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Management */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Gateway</span>
                <span className="text-sm font-medium capitalize">{order.payment_gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payment ID</span>
                <span className="text-sm font-mono">{order.payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Amount</span>
                <span className="text-sm font-medium">{formatPrice(order.total_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Currency</span>
                <span className="text-sm font-medium">{order.currency}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Method</span>
                <span className="text-sm font-medium capitalize">{order.shipping_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cost</span>
                <span className="text-sm font-medium">{formatPrice(order.shipping_cents)}</span>
              </div>
              {trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-sm">Tracking</span>
                  <span className="text-sm font-mono">{trackingNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
