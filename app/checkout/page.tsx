"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CreditCard, Truck, Shield, Lock } from "lucide-react"
import Link from "next/link"
import { formatPrice, calculateTax } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { PaymentForm } from "@/components/checkout/payment-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Address {
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone?: string
}

const countries = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
]

const shippingMethods = [
  { id: "standard", name: "Standard International", description: "7-14 business days", price: 1500 },
  { id: "express", name: "Express International", description: "3-7 business days", price: 3500 },
  { id: "premium", name: "Premium White Glove", description: "2-5 business days with insurance", price: 7500 },
]

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { toast } = useToast()

  const [billingAddress, setBillingAddress] = useState<Address>({
    first_name: "",
    last_name: "",
    company: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    phone: "",
  })

  const [shippingAddress, setShippingAddress] = useState<Address>({
    first_name: "",
    last_name: "",
    company: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    phone: "",
  })

  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [selectedShipping, setSelectedShipping] = useState("standard")
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState("")

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()
  const shippingCost = shippingMethods.find((m) => m.id === selectedShipping)?.price || 1500
  const taxCost = calculateTax(subtotal, billingAddress.country, billingAddress.state)
  const finalTotal = subtotal + shippingCost + taxCost - discount

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      window.location.href = "/cart"
    }
  }, [items])

  // Copy billing to shipping when checkbox is checked
  useEffect(() => {
    if (sameAsBilling) {
      setShippingAddress(billingAddress)
    }
  }, [billingAddress, sameAsBilling])

  const handleAddressChange = (type: "billing" | "shipping", field: keyof Address, value: string) => {
    if (type === "billing") {
      setBillingAddress((prev) => ({ ...prev, [field]: value }))
    } else {
      setShippingAddress((prev) => ({ ...prev, [field]: value }))
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, order_total: subtotal }),
      })

      const result = await response.json()

      if (result.success) {
        setDiscount(result.data.discount_amount)
        toast({
          title: "Coupon applied!",
          description: `You saved ${formatPrice(result.data.discount_amount)}`,
        })
      } else {
        toast({
          title: "Invalid coupon",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      })
    }
  }

  const createPaymentIntent = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "usd",
          billing_address: billingAddress,
          shipping_address: sameAsBilling ? billingAddress : shippingAddress,
          items,
          shipping_method: selectedShipping,
          coupon_code: couponCode,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setClientSecret(result.data.client_secret)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl font-bold">Checkout</h1>
            <Button variant="outline" asChild>
              <Link href="/cart">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing-first-name">First Name *</Label>
                      <Input
                        id="billing-first-name"
                        value={billingAddress.first_name}
                        onChange={(e) => handleAddressChange("billing", "first_name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-last-name">Last Name *</Label>
                      <Input
                        id="billing-last-name"
                        value={billingAddress.last_name}
                        onChange={(e) => handleAddressChange("billing", "last_name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billing-company">Company</Label>
                    <Input
                      id="billing-company"
                      value={billingAddress.company}
                      onChange={(e) => handleAddressChange("billing", "company", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="billing-address-1">Address Line 1 *</Label>
                    <Input
                      id="billing-address-1"
                      value={billingAddress.address_line_1}
                      onChange={(e) => handleAddressChange("billing", "address_line_1", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="billing-address-2">Address Line 2</Label>
                    <Input
                      id="billing-address-2"
                      value={billingAddress.address_line_2}
                      onChange={(e) => handleAddressChange("billing", "address_line_2", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing-city">City *</Label>
                      <Input
                        id="billing-city"
                        value={billingAddress.city}
                        onChange={(e) => handleAddressChange("billing", "city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-state">State/Province</Label>
                      <Input
                        id="billing-state"
                        value={billingAddress.state}
                        onChange={(e) => handleAddressChange("billing", "state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing-postal">Postal Code *</Label>
                      <Input
                        id="billing-postal"
                        value={billingAddress.postal_code}
                        onChange={(e) => handleAddressChange("billing", "postal_code", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-country">Country *</Label>
                      <Select
                        value={billingAddress.country}
                        onValueChange={(value) => handleAddressChange("billing", "country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billing-phone">Phone</Label>
                    <Input
                      id="billing-phone"
                      type="tel"
                      value={billingAddress.phone}
                      onChange={(e) => handleAddressChange("billing", "phone", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="same-as-billing"
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                    />
                    <Label htmlFor="same-as-billing">Same as billing address</Label>
                  </div>

                  {!sameAsBilling && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping-first-name">First Name *</Label>
                          <Input
                            id="shipping-first-name"
                            value={shippingAddress.first_name}
                            onChange={(e) => handleAddressChange("shipping", "first_name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-last-name">Last Name *</Label>
                          <Input
                            id="shipping-last-name"
                            value={shippingAddress.last_name}
                            onChange={(e) => handleAddressChange("shipping", "last_name", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shipping-company">Company</Label>
                        <Input
                          id="shipping-company"
                          value={shippingAddress.company}
                          onChange={(e) => handleAddressChange("shipping", "company", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="shipping-address-1">Address Line 1 *</Label>
                        <Input
                          id="shipping-address-1"
                          value={shippingAddress.address_line_1}
                          onChange={(e) => handleAddressChange("shipping", "address_line_1", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="shipping-address-2">Address Line 2</Label>
                        <Input
                          id="shipping-address-2"
                          value={shippingAddress.address_line_2}
                          onChange={(e) => handleAddressChange("shipping", "address_line_2", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping-city">City *</Label>
                          <Input
                            id="shipping-city"
                            value={shippingAddress.city}
                            onChange={(e) => handleAddressChange("shipping", "city", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-state">State/Province</Label>
                          <Input
                            id="shipping-state"
                            value={shippingAddress.state}
                            onChange={(e) => handleAddressChange("shipping", "state", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping-postal">Postal Code *</Label>
                          <Input
                            id="shipping-postal"
                            value={shippingAddress.postal_code}
                            onChange={(e) => handleAddressChange("shipping", "postal_code", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-country">Country *</Label>
                          <Select
                            value={shippingAddress.country}
                            onValueChange={(value) => handleAddressChange("shipping", "country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shipping-phone">Phone</Label>
                        <Input
                          id="shipping-phone"
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => handleAddressChange("shipping", "phone", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shippingMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedShipping === method.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedShipping(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(method.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.variant_id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product_title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {Object.entries(item.variant_attributes)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(" • ")}
                          </p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price_cents * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Coupon */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(taxCost)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="font-serif">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm
                        clientSecret={clientSecret}
                        onSuccess={() => {
                          clearCart()
                          window.location.href = "/checkout/success"
                        }}
                      />
                    </Elements>
                  ) : (
                    <Button onClick={createPaymentIntent} disabled={isProcessing} className="w-full" size="lg">
                      <Lock className="w-4 h-4 mr-2" />
                      {isProcessing ? "Processing..." : "Continue to Payment"}
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Secured by SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
