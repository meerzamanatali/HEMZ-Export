import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6 animate-in zoom-in duration-500" />
            <h1 className="font-serif text-4xl font-bold mb-4 animate-in slide-in-from-bottom duration-500 delay-100">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom duration-500 delay-200">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="text-left mb-8 animate-in slide-in-from-bottom duration-500 delay-300">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Order Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation with your order details shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Processing & Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Your order will be processed within 1-2 business days and shipped according to your selected method.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Tracking Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Once shipped, you'll receive tracking information to monitor your delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 animate-in slide-in-from-bottom duration-500 delay-400">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <div className="text-sm text-muted-foreground">
              <p>
                Need help?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
