// TypeScript types for HEMZ Pashmina e-commerce system

export interface Product {
  id: number
  title: string
  slug: string
  description?: string
  base_price_cents: number
  currency: string
  weight_grams: number
  material?: string
  care_instructions?: string
  moq: number
  lead_time_days: number
  status: "active" | "inactive" | "discontinued"
  variants: ProductVariant[]
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  sku: string
  attributes_json: Record<string, any> // {color: "ivory", size: "70x200cm"}
  price_cents?: number // null means use base_price from product
  stock_quantity: number
  reserved_quantity: number
  available_quantity: number
  weight_grams?: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  variant_id?: number
  url: string
  alt_text?: string
  sort_order: number
  created_at: string
}

export interface CartItem {
  variant_id: number
  quantity: number
  price_cents: number // Price at time of adding to cart
  product_title: string
  variant_sku: string
  variant_attributes: Record<string, any>
}

export interface Cart {
  id: number
  user_id?: number
  session_id: string
  items_json: CartItem[]
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Address {
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

export interface Order {
  id: number
  order_number: string
  user_id?: number
  email: string
  billing_address_json: Address
  shipping_address_json: Address
  items_json: CartItem[]
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  discount_cents: number
  total_cents: number
  currency: string
  status: OrderStatus
  payment_gateway?: string
  payment_id?: string
  shipping_method?: string
  tracking_number?: string
  notes?: string
  quote_id?: number
  created_at: string
  updated_at: string
}

export type OrderStatus = "created" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export interface Payment {
  id: number
  order_id: number
  gateway: "stripe" | "paypal" | "razorpay"
  gateway_payment_id: string
  amount_cents: number
  currency: string
  status: PaymentStatus
  raw_response_json?: Record<string, any>
  created_at: string
  updated_at: string
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled" | "refunded"

export interface Coupon {
  id: number
  code: string
  discount_type: "percent" | "amount"
  value_cents: number
  minimum_order_cents: number
  maximum_discount_cents?: number
  usage_limit?: number
  used_count: number
  active: boolean
  expires_at?: string
  created_at: string
}

export interface ShippingRate {
  id: number
  name: string
  description?: string
  rate_type: "flat" | "weight_based" | "free"
  base_rate_cents: number
  per_kg_cents: number
  free_shipping_threshold_cents?: number
  countries_json: string[]
  active: boolean
  created_at: string
}

export interface TaxRate {
  id: number
  name: string
  rate_percentage: number
  country_code?: string
  state_code?: string
  tax_type: string
  active: boolean
  created_at: string
}

export interface Quote {
  id: number
  quote_number: string
  customer_name: string
  customer_email: string
  customer_company?: string
  customer_country?: string
  items_json: CartItem[]
  total_estimated_cents?: number
  currency: string
  status: "pending" | "approved" | "converted" | "expired"
  order_id?: number
  expires_at?: string
  created_at: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Checkout types
export interface CheckoutSession {
  cart_id: number
  billing_address: Address
  shipping_address: Address
  shipping_method_id: number
  coupon_code?: string
  payment_method: "stripe" | "paypal"
  subtotal_cents: number
  shipping_cents: number
  tax_cents: number
  discount_cents: number
  total_cents: number
}

export interface PaymentIntent {
  client_secret: string
  payment_intent_id: string
  amount_cents: number
  currency: string
}
