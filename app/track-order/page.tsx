"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Package, Truck, CheckCircle, Clock, Calendar, ArrowRight } from "lucide-react"
import { getOrderByNumber, getOrderFromLocalStorage } from "@/lib/supabase"
import type { Order } from "@/lib/supabase"
import ShipmentTracker from "@/components/shipment-tracker"

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError(null)
    setOrder(null)
    setSearched(true)

    try {
      // Try to get order from Supabase
      const { data, error } = await getOrderByNumber(orderNumber.trim())

      if (error) {
        console.error("Error fetching from Supabase:", error)
        // Try to get order from localStorage as fallback
        const localOrder = getOrderFromLocalStorage(orderNumber.trim())

        if (localOrder) {
          setOrder(localOrder)
        } else {
          setError("Order not found. Please check your order number and try again.")
        }
      } else if (data) {
        setOrder(data)
      } else {
        // Try to get order from localStorage as fallback
        const localOrder = getOrderFromLocalStorage(orderNumber.trim())

        if (localOrder) {
          setOrder(localOrder)
        } else {
          setError("Order not found. Please check your order number and try again.")
        }
      }
    } catch (err) {
      console.error("Exception when fetching order:", err)

      // Try to get order from localStorage as fallback
      const localOrder = getOrderFromLocalStorage(orderNumber.trim())

      if (localOrder) {
        setOrder(localOrder)
      } else {
        setError("An error occurred while fetching your order. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get status step
  const getStatusStep = (status: string): number => {
    switch (status) {
      case "pending":
        return 1
      case "processing":
        return 2
      case "shipped":
        return 3
      case "delivered":
        return 4
      default:
        return 0
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-6 text-center">Track Your Order</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Enter your order number to check the status of your order.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. UMI-123456-7890"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-fuchsia-600 text-white px-6 py-3 rounded-md font-medium hover:bg-fuchsia-700 transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    "Track Order"
                  )}
                </button>
              </form>

              {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
            </div>
          </div>

          {searched && !loading && !error && order && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Order {order.order_number}</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  {order.tracking_number && (
                    <div>
                      <p className="text-gray-500">Tracking Number</p>
                      <p className="font-medium">{order.tracking_number}</p>
                    </div>
                  )}
                  {order.estimated_delivery && (
                    <div>
                      <p className="text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">{order.estimated_delivery}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-6">Order Progress</h3>

                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200">
                    <div
                      className="h-full bg-fuchsia-600"
                      style={{ width: `${(getStatusStep(order.status) / 4) * 100}%` }}
                    ></div>
                  </div>

                  {/* Status Steps */}
                  <div className="grid grid-cols-4 relative">
                    <div className="text-center">
                      <div
                        className={`h-10 w-10 rounded-full ${getStatusStep(order.status) >= 1 ? "bg-fuchsia-600 text-white" : "bg-gray-200 text-gray-400"} flex items-center justify-center mx-auto z-10`}
                      >
                        <Clock className="h-5 w-5" />
                      </div>
                      <p className="mt-2 text-sm font-medium">Pending</p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`h-10 w-10 rounded-full ${getStatusStep(order.status) >= 2 ? "bg-fuchsia-600 text-white" : "bg-gray-200 text-gray-400"} flex items-center justify-center mx-auto z-10`}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                      <p className="mt-2 text-sm font-medium">Processing</p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`h-10 w-10 rounded-full ${getStatusStep(order.status) >= 3 ? "bg-fuchsia-600 text-white" : "bg-gray-200 text-gray-400"} flex items-center justify-center mx-auto z-10`}
                      >
                        <Truck className="h-5 w-5" />
                      </div>
                      <p className="mt-2 text-sm font-medium">Shipped</p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`h-10 w-10 rounded-full ${getStatusStep(order.status) >= 4 ? "bg-fuchsia-600 text-white" : "bg-gray-200 text-gray-400"} flex items-center justify-center mx-auto z-10`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <p className="mt-2 text-sm font-medium">Delivered</p>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>

                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 flex items-start">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
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
                        <h4 className="text-sm font-medium">Event Planning with Lungi</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.event_booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm font-medium">R{order.event_booking.price.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>R{order.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>R{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Shipping Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h4>
                    <p className="text-sm">{order.shipping_address}</p>
                    <p className="text-sm">
                      {order.shipping_city}, {order.shipping_postal_code}
                    </p>
                    <p className="text-sm">{order.shipping_country}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
                    <p className="text-sm">{order.customer_name}</p>
                    <p className="text-sm">{order.customer_email}</p>
                    {order.customer_phone && <p className="text-sm">{order.customer_phone}</p>}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  If you have any questions about your order, please contact our customer support team.
                </p>
                <div className="mt-4">
                  <Link
                    href="/contact"
                    className="text-fuchsia-600 font-medium hover:underline inline-flex items-center text-sm"
                  >
                    Need help with your order?
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!searched && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-2">Track Your Orders</h2>
              <p className="text-gray-600 mb-4">
                Enter your order number above to check the current status of your order.
              </p>
              <p className="text-gray-600 text-sm">Your order number can be found in your order confirmation email.</p>
            </div>
          )}

          {!searched && (
            <div className="mt-8">
              <h2 className="text-xl font-medium mb-4">Track with Shiplogic</h2>
              <p className="text-gray-600 mb-4">
                If you have a Shiplogic tracking number, you can track your package directly:
              </p>
              <ShipmentTracker />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
