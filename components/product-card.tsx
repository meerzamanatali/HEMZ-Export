import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  title: string
  type: string
  material: string
  sizes: string[]
  color: string[]
  price: number
  currency: string
  availability: string
  discount: number
  photos: string[]
  description: string
  care_instructions: string
  moq: number
  lead_time_days: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-in fade-in slide-in-from-bottom duration-600 border-0 shadow-md hover:shadow-primary/10">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={product.photos[0] || "/placeholder.svg"}
          alt={product.title}
          width={400}
          height={400}
          className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-700 ease-out"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground animate-in slide-in-from-left duration-500 delay-200 hover:scale-110 transition-transform">
            -{product.discount}%
          </Badge>
        )}
        {product.availability === "InStock" && (
          <Badge className="absolute top-2 right-2 bg-green-600 text-white animate-in slide-in-from-right duration-500 delay-300 hover:scale-110 transition-transform">
            In Stock
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="transform scale-75 group-hover:scale-100 transition-all duration-300 delay-100 shadow-lg hover:shadow-xl"
          >
            <Link href={`/products/${product.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="mb-2">
          <Badge
            variant="outline"
            className="text-xs transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            {product.type}
          </Badge>
        </div>

        <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {product.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-2 transition-colors duration-300 group-hover:text-foreground">
          {product.material}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-primary transition-all duration-300 group-hover:scale-105">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary transition-all duration-300 group-hover:scale-105">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-3 transition-colors duration-300 group-hover:text-foreground">
          MOQ: {product.moq} pieces • Lead time: {product.lead_time_days} days
        </div>

        <Button
          asChild
          className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg group-hover:bg-primary group-hover:shadow-primary/25"
          size="sm"
        >
          <Link href={`/products/${product.id}`}>
            <ShoppingCart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
            Request Quote
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
