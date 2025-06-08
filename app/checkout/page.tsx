"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard } from "lucide-react"
import { useCart } from "@/context/cart-context"
import ShippingRateCalculator from "@/components/shipping-rate-calculator"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal } = useCart()
  const shipping = subtotal > 0 ? 50 : 0
  const total = subtotal + shipping

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "South Africa",
  })

  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [sdkLoaded, setSdkLoaded] = useState(false)

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentStatus("processing")

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      setErrorMessage("Please fill in all required fields")
      setPaymentStatus("error")
      return
    }

    // Simulate payment processing
    setTimeout(() => {
      // For demo purposes, always succeed
      setPaymentStatus("success")

      // Generate a random order number
      const generatedOrderNumber = `UMI-${Math.floor(Math.random() * 10000)}`
      setOrderNumber(generatedOrderNumber)

      // Redirect to success page
      router.push(`/checkout/success?order=${generatedOrderNumber}`)
    }, 2000)
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/cart" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-serif font-medium mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">Shipping Information</h2>

              {paymentStatus === "error" && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="South Africa">South Africa</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked
                        readOnly
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="card" className="ml-2 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                      <div className="ml-auto flex space-x-2">
                        <Image src="/visa.svg" alt="Visa" width={40} height={25} />
                        <Image src="/mastercard.svg" alt="Mastercard" width={40} height={25} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Secure payment processing. Your card details are never stored on our servers.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentStatus === "processing"}
                  className="w-full bg-fuchsia-600 text-white py-3 rounded-md font-medium hover:bg-fuchsia-700 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {paymentStatus === "processing" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay R{total.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">R{((item.product.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R{(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>R{shipping.toFixed(2)}</span>
                </div>
                <div className="mt-2">
                  <details className="text-sm">
                    <summary className="text-fuchsia-600 cursor-pointer">Calculate shipping cost</summary>
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <ShippingRateCalculator />
                    </div>
                  </details>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                  <span>Total</span>
                  <span>R{(total || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center">
                  <Image src="/secure-payment-badges.png" alt="Secure Payment" width={120} height={20} />
                  <span className="ml-2 text-xs text-gray-500">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
