"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Calendar, Loader2 } from "lucide-react"
import { getOrderById, updateOrderStatus } from "@/lib/admin-service"
import type { Order, OrderStatus } from "@/lib/supabase"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false)

  useEffect(() => {
    if (!orderId) {
      router.push("/admin/orders")
      return
    }

    fetchOrderData()
  }, [orderId, router])

  const fetchOrderData = async () => {
    try {
      setLoading(true)

      const { data, error } = await getOrderById(orderId)

      if (error) {
        throw new Error("Failed to fetch order data")
      }

      setOrder(data)
    } catch (err) {
      console.error("Error fetching order data:", err)
      setError("Failed to load order data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(true)
      setStatusUpdateSuccess(false)

      const { success, error } = await updateOrderStatus(orderId, newStatus)

      if (!success || error) {
        throw new Error("Failed to update order status")
      }

      // Update the order in the local state
      if (order) {
        setOrder({
          ...order,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
      }

      setStatusUpdateSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating order status:", err)
      setError("Failed to update order status. Please try again.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="animate-spin h-8 w-8 text-fuchsia-600" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div>
        <Link href="/admin/orders" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>

        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error || "Order not found"}</div>
      </div>
    )
  }

  return (
    <div>
      <Link href="/admin/orders" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Orders
      </Link>

      <h1 className="text-3xl font-serif font-medium mb-6">Order #{order.order_number}</h1>

      {statusUpdateSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">Order status updated successfully!</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange("pending")}
                    disabled={updatingStatus || order.status === "pending"}
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange("processing")}
                    disabled={updatingStatus || order.status === "processing"}
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "processing"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => handleStatusChange("shipped")}
                    disabled={updatingStatus || order.status === "shipped"}
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "shipped"
                        ? "bg-purple-500 text-white"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => handleStatusChange("delivered")}
                    disabled={updatingStatus || order.status === "delivered"}
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={updatingStatus || order.status === "cancelled"}
                    className={`px-3 py-1 text-sm rounded-full ${
                      order.status === "cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Cancelled
                  </button>
                </div>
                {updatingStatus && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating status...
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                  <p className="mt-1">{order.customer_name}</p>
                  <p className="text-gray-600">{order.customer_email}</p>
                  {order.customer_phone && <p className="text-gray-600">{order.customer_phone}</p>}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                  <p className="mt-1">{order.shipping_address}</p>
                  <p>
                    {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                  <p>{order.shipping_country}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                  <p className="mt-1">Payment ID: {order.payment_id || "N/A"}</p>
                </div>

                {order.tracking_number && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tracking Information</h3>
                    <p className="mt-1">Tracking Number: {order.tracking_number}</p>
                    {order.estimated_delivery && <p>Estimated Delivery: {order.estimated_delivery}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-medium text-gray-900">R{order.total.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-fuchsia-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900">Order Items</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={`${item.id}`} className="p-6 flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-gray-500">Price: R{item.price.toFixed(2)} each</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              {order.event_booking && (
                <div className="p-6 flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-fuchsia-100 rounded-md overflow-hidden relative flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-fuchsia-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">Event Planning with Lungi</h3>
                    <p className="text-gray-500 mt-1">
                      Date: {new Date(order.event_booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">Location: {order.event_booking.location}</p>
                    <p className="text-gray-500">Event Type: {order.event_booking.eventType}</p>
                    <p className="text-gray-500">Guest Count: {order.event_booking.guestCount}</p>
                    {order.event_booking.additionalInfo && (
                      <p className="text-gray-500">Additional Info: {order.event_booking.additionalInfo}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium">R{order.event_booking.price.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="space-y-2">
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

            {order.notes && (
              <div className="p-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-2">Order Notes</h3>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
