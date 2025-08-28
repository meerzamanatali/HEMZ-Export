import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCarousel } from "@/components/product-carousel"
import { ProductTabs } from "@/components/product-tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Share2, Heart, ShoppingCart, Mail, Phone } from "lucide-react"
import Link from "next/link"
import productsData from "@/data/products.json"
import type { Metadata } from "next"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = productsData.products.find((p) => p.id === params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  return {
    title: `${product.title} | Luxury Textiles Export`,
    description: `${product.description} Premium ${product.type.toLowerCase()} made from ${product.material}. Starting at $${discountedPrice.toFixed(2)}. MOQ: ${product.moq} pieces.`,
    keywords: [
      product.type.toLowerCase(),
      "cashmere",
      "pashmina",
      "export",
      "wholesale",
      "luxury textiles",
      product.material.toLowerCase(),
      ...product.color.map((c) => c.toLowerCase()),
    ],
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.photos[0] || "/placeholder.svg",
          width: 800,
          height: 600,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.photos[0] || "/placeholder.svg"],
    },
  }
}

export async function generateStaticParams() {
  return productsData.products.map((product) => ({
    id: product.id,
  }))
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = productsData.products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "Luxury Textiles Export Co.",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Luxury Textiles Export Co.",
    },
    offers: {
      "@type": "Offer",
      price: discountedPrice.toString(),
      priceCurrency: product.currency,
      availability: product.availability === "InStock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceValidUntil: "2024-12-31",
      seller: {
        "@type": "Organization",
        name: "Luxury Textiles Export Co.",
      },
    },
    image: product.photos,
    material: product.material,
    color: product.color,
    category: "Textiles",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link
              href="/products"
              className="hover:text-primary transition-colors flex items-center focus:text-primary focus:outline-none focus:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              Back to Products
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <ProductCarousel images={product.photos} productTitle={product.title} />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{product.type}</Badge>
                  {product.availability === "InStock" && <Badge className="bg-green-600 text-white">In Stock</Badge>}
                  {product.discount > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground">-{product.discount}% OFF</Badge>
                  )}
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">{product.title}</h1>

                <p className="text-muted-foreground mb-4">SKU: {product.id}</p>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-4">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                      <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-destructive font-medium">
                        Save ${(product.price - discountedPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <Separator />

              {/* Product Details */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg font-semibold">Product Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Material:</span>
                    <p className="text-muted-foreground">{product.material}</p>
                  </div>
                  <div>
                    <span className="font-medium">Available Sizes:</span>
                    <p className="text-muted-foreground">{product.sizes.join(", ")}</p>
                  </div>
                  <div>
                    <span className="font-medium">Colors:</span>
                    <p className="text-muted-foreground">{product.color.join(", ")}</p>
                  </div>
                  <div>
                    <span className="font-medium">Lead Time:</span>
                    <p className="text-muted-foreground">{product.lead_time_days} days</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Export Information */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-serif text-lg font-semibold mb-3">Export Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Minimum Order:</span>
                      <span className="text-primary font-bold">{product.moq} pieces</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Production Time:</span>
                      <span className="text-primary font-bold">{product.lead_time_days} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href={`/contact?product=${product.id}`}>
                    <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                    Request Quote
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" asChild>
                    <a href="mailto:export@luxurytextiles.com?subject=Inquiry about ${product.title}">
                      <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                      Email Inquiry
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:+911942501234">
                      <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                      Call Us
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-4 pt-2">
                  <Button variant="ghost" size="sm" aria-label="Add to wishlist">
                    <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
                    Add to Wishlist
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="Share product">
                    <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
                    Share Product
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <section className="mt-12" aria-label="Additional product information">
            <ProductTabs product={product} />
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
