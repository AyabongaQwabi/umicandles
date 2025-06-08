"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Package, Calendar, Search, ArrowRight, Loader2 } from "lucide-react"
import { getOrdersByEmail, type Order } from "@/lib/supabase"

interface OrderHistoryProps {
  email?: string
}

export default function OrderHistory({ email }: OrderHistoryProps) {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchEmail, setSearchEmail] = useState(email || "")

  useEffect(() => {
    if (email) {
      fetchOrders(email)
    } else {
      setLoading(false)
    }
  }, [email])

  const fetchOrders = async (emailToFetch: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await getOrdersByEmail(emailToFetch)

      if (error) {
        console.error("Error fetching orders:", error)
        setError("Unable to fetch your orders. Please try again later.")
      } else if (data && data.length > 0) {
        setOrders(data)
      } else {
        setOrders([])
        setError("No orders found for this email address.")
      }
    } catch (err) {
      console.error("Exception when fetching orders:", err)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchEmail.trim()) {
      fetchOrders(searchEmail.trim())
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-medium mb-4">Your Order History</h2>

        {!email && (
          <form onSubmit={handleSubmit} className="mb-6">
            <p className="text-gray-600 mb-4">Enter your email address to view your order history.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-fuchsia-600 text-white px-6 py-2 rounded-md font-medium hover:bg-fuchsia-700 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Loading...
                  </>
                ) : (
                  "View Orders"
                )}
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader2 className="animate-spin h-8 w-8 mx-auto text-fuchsia-600 mb-4" />
            <p>Loading your orders...</p>
          </div>
        )}

        {error && !loading && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">{error}</div>}

        {orders && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">Order #{order.order_number}</span>
                      <span
                        className={`ml-3 inline-block h-2 w-2 rounded-full ${
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
                      <span className="ml-1 text-sm text-gray-600 capitalize">{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Link
                    href={`/track-order?order=${order.order_number}`}
                    className="text-fuchsia-600 text-sm font-medium hover:underline flex items-center mt-2 sm:mt-0"
                  >
                    Track Order
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={`${order.id}-${item.id}`} className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × R{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600">
                        +{order.items.length - 2} more {order.items.length - 2 === 1 ? "item" : "items"}
                      </p>
                    )}

                    {order.event_booking && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-fuchsia-100 rounded-md overflow-hidden relative flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-fuchsia-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Event Planning with Lungi</p>
                          <p className="text-xs text-gray-600">
                            {new Date(order.event_booking.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-sm font-medium">R{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {orders && orders.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <Link href="/products" className="inline-flex items-center text-fuchsia-600 font-medium hover:underline">
              Start shopping
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
