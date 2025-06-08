"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Package, Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { getAllOrders, updateOrderStatus } from "@/lib/admin-service"
import type { Order, OrderStatus } from "@/lib/supabase"
import Link from "next/link"

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialStatus = searchParams.get("status") as OrderStatus | undefined

  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalOrders, setTotalOrders] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(initialStatus)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const ordersPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const { data, count, error } = await getAllOrders(currentPage, ordersPerPage, statusFilter)

      if (error) {
        throw new Error("Failed to fetch orders")
      }

      setOrders(data)
      setTotalOrders(count)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId)

      const { success, error } = await updateOrderStatus(orderId, newStatus)

      if (!success || error) {
        throw new Error("Failed to update order status")
      }

      // Update the order in the local state
      if (orders) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order,
          ),
        )
      }
    } catch (err) {
      console.error("Error updating order status:", err)
      alert("Failed to update order status. Please try again.")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleFilterChange = (status: OrderStatus | undefined) => {
    setStatusFilter(status)
    setCurrentPage(1)

    // Update URL
    if (status) {
      router.push(`/admin/orders?status=${status}`)
    } else {
      router.push("/admin/orders")
    }
  }

  const totalPages = Math.ceil(totalOrders / ordersPerPage)

  return (
    <div>
      <h1 className="text-3xl font-serif font-medium mb-8">Orders Management</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <span className="mr-2">Filter by status:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange(undefined)}
                className={`px-3 py-1 text-sm rounded-full ${
                  !statusFilter ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("pending")}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleFilterChange("processing")}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === "processing"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => handleFilterChange("shipped")}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === "shipped"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => handleFilterChange("delivered")}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === "delivered"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => handleFilterChange("cancelled")}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === "cancelled" ? "bg-red-500 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-fuchsia-600 mr-2" />
          <span>Loading orders...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      ) : orders && orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-fuchsia-600"
                          >
                            #{order.order_number}
                          </Link>
                          <div className="text-sm text-gray-500">{order.items.length} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">R{order.total.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        {order.shipping_cost > 0
                          ? `Includes R${order.shipping_cost.toFixed(2)} shipping`
                          : "Free shipping"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        {updatingOrderId === order.id ? (
                          <Loader2 className="animate-spin h-5 w-5 text-fuchsia-600" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(currentPage * ordersPerPage, totalOrders)}</span> of{" "}
                    <span className="font-medium">{totalOrders}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-fuchsia-50 border-fuchsia-500 text-fuchsia-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500">
            {statusFilter
              ? `There are no orders with status "${statusFilter}".`
              : "There are no orders in the system yet."}
          </p>
        </div>
      )}
    </div>
  )
}
