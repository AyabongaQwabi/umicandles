"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("message") || "Your payment could not be processed."

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-50 p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-serif font-medium text-red-800 mb-2">Payment Failed</h1>
            <p className="text-red-700 mb-6">{errorMessage}</p>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-medium mb-4">What happened?</h2>
            <p className="text-gray-600 mb-6">Your payment was not successful. This could be due to:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
              <li>Insufficient funds in your account</li>
              <li>Incorrect card details</li>
              <li>Your card was declined by your bank</li>
              <li>A temporary issue with our payment system</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Don't worry, your order has not been placed and you have not been charged. You can try again with a
              different payment method or contact your bank for more information.
            </p>
          </div>

          <div className="p-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart"
              className="bg-fuchsia-600 text-white px-6 py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors inline-flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Cart
            </Link>
            <Link
              href="/contact"
              className="border border-fuchsia-600 text-fuchsia-600 px-6 py-3 rounded-full font-medium hover:bg-fuchsia-50 transition-colors inline-flex items-center justify-center"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
