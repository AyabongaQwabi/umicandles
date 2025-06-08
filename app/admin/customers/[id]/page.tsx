"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Package, Loader2 } from "lucide-react"
import { getCustomerWithOrders } from "@/lib/admin-service"
import type { Order } from "@/lib/supabase"

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!customerId) {
      router.push("/admin/customers")
      return
    }

    fetchCustomerData()
  }, [customerId, router])

  const fetchCustomerData = async () => {
    try {
      setLoading(true)

      const { customer, orders, error } = await getCustomerWithOrders(customerId)

      if (error) {
        throw new Error("Failed to fetch customer data")
      }

      setCustomer(customer)
      setOrders(orders)
    } catch (err) {
      console.error("Error fetching customer data:", err)
      setError("Failed to load customer data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="animate-spin h-8 w-8 text-fuchsia-600" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div>
        <Link href="/admin/customers" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Link>

        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error || "Customer not found"}</div>
      </div>
    )
  }

  return (
    <div>
      <Link href="/admin/customers" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-900">
                    {customer.first_name} {customer.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customer since {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{customer.phone || "Not provided"}</p>
                  </div>
                </div>

                {customer.default_shipping_address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Default Shipping Address</p>
                      <p className="text-gray-900">{customer.default_shipping_address.address}</p>
                      <p className="text-gray-900">
                        {customer.default_shipping_address.city}, {customer.default_shipping_address.postal_code}
                      </p>
                      <p className="text-gray-900">{customer.default_shipping_address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-medium text-gray-900">{orders?.length || 0}</p>
                </div>
                <div className="h-12 w-12 bg-fuchsia-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-fuchsia-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900">Order History</h2>
            </div>

            {orders && orders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Order #{order.order_number}</h3>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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

                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × R{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {order.event_booking && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 bg-fuchsia-100 rounded-md overflow-hidden relative flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-fuchsia-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">Event Planning with Lungi</p>
                            <p className="text-xs text-gray-600">
                              {new Date(order.event_booking.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="text-sm font-medium">R{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                <p className="text-gray-500">This customer hasn't placed any orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
