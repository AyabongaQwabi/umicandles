"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check, Truck, Calendar, ArrowRight } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { getOrderByNumber, getOrderFromLocalStorage } from "@/lib/supabase"
import type { Order } from "@/lib/supabase"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const { clearCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use a ref to track if we've already cleared the cart
  const cartCleared = useRef(false)

  useEffect(() => {
    // Only clear the cart once when the component mounts
    if (!cartCleared.current) {
      clearCart()
      cartCleared.current = true
    }
  }, []) // Empty dependency array - only runs once on mount

  useEffect(() => {
    // Fetch order details if order number is provided
    if (orderNumber) {
      const fetchOrder = async () => {
        try {
          setLoading(true)

          // Try to get order from Supabase
          const { data, error } = await getOrderByNumber(orderNumber)

          if (error) {
            console.error("Error fetching from Supabase:", error)
            // Try to get order from localStorage as fallback
            const localOrder = getOrderFromLocalStorage(orderNumber)

            if (localOrder) {
              setOrder(localOrder)
            } else {
              setError("Order not found in database or local storage")
            }
          } else if (data) {
            setOrder(data)
          } else {
            // Try to get order from localStorage as fallback
            const localOrder = getOrderFromLocalStorage(orderNumber)

            if (localOrder) {
              setOrder(localOrder)
            } else {
              setError("Order not found")
            }
          }
        } catch (err) {
          console.error("Exception when fetching order:", err)

          // Try to get order from localStorage as fallback
          const localOrder = getOrderFromLocalStorage(orderNumber)

          if (localOrder) {
            setOrder(localOrder)
          } else {
            setError("An error occurred while fetching your order")
          }
        } finally {
          setLoading(false)
        }
      }

      fetchOrder()
    } else {
      setLoading(false)
      setError("No order number provided")
    }
  }, [orderNumber]) // Only depends on orderNumber

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 p-8 text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-serif font-medium text-green-800 mb-2">Thank You for Your Order!</h1>
              <p className="text-green-700 mb-2">Your payment was successful and your order has been placed.</p>
              {orderNumber && (
                <p className="text-gray-600 font-medium">
                  Order Reference: <span className="font-bold">{orderNumber}</span>
                </p>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
                <p>Loading your order details...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Link
                  href="/track-order"
                  className="text-fuchsia-600 font-medium hover:underline inline-flex items-center"
                >
                  Track your order
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ) : order ? (
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">Order Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="flex items-center">
                        <span
                          className={`inline-block h-2 w-2 rounded-full mr-2 ${
                            order.status === "pending"
                              ? "bg-yellow-500"
                              : order.status === "processing"
                                ? "bg-blue-500"
                                : order.status === "shipped"
                                  ? "bg-purple-500"
                                  : order.status === "delivered"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                          }`}
                        ></span>
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                      <p>{order.shipping_address}</p>
                      <p>
                        {order.shipping_city}, {order.shipping_postal_code}
                      </p>
                      <p>{order.shipping_country}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                      <p>{order.customer_name}</p>
                      <p>{order.customer_email}</p>
                      {order.customer_phone && <p>{order.customer_phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">Order Summary</h2>

                  <div className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 flex items-start">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}

                    {order.event_booking && (
                      <div className="py-4 flex items-start">
                        <div className="flex-shrink-0 w-16 h-16 bg-fuchsia-100 rounded-md overflow-hidden relative flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-fuchsia-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium">Event Planning with Lungi</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.event_booking.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-medium">R{order.event_booking.price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>R{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>R{order.shipping_cost.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                      <span>Total</span>
                      <span>R{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Truck className="h-6 w-6 text-fuchsia-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">Shipping Information</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        You will receive a confirmation email with your order details and tracking information once your
                        order ships.
                      </p>
                      <Link
                        href="/track-order"
                        className="mt-2 text-fuchsia-600 font-medium hover:underline inline-flex items-center text-sm"
                      >
                        Track your order
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="p-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-fuchsia-600 text-white px-6 py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors inline-flex items-center justify-center"
              >
                Continue Shopping
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
      </div>
    </main>
  )
}
