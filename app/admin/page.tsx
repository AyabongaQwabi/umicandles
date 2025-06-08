"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Users, ArrowRight, Loader2 } from "lucide-react"
import { getAllOrders, getAllCustomers } from "@/lib/admin-service"

export default function AdminDashboard() {
  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [customerCount, setCustomerCount] = useState<number | null>(null)
  const [pendingOrders, setPendingOrders] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Get total orders
        const { count: totalOrders, error: ordersError } = await getAllOrders(1, 1)

        if (ordersError) {
          throw new Error("Failed to fetch orders")
        }

        setOrderCount(totalOrders)

        // Get pending orders
        const { count: pendingCount, error: pendingError } = await getAllOrders(1, 1, "pending")

        if (pendingError) {
          throw new Error("Failed to fetch pending orders")
        }

        setPendingOrders(pendingCount)

        // Get total customers
        const { count: totalCustomers, error: customersError } = await getAllCustomers(1, 1)

        if (customersError) {
          throw new Error("Failed to fetch customers")
        }

        setCustomerCount(totalCustomers)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="animate-spin h-8 w-8 text-fuchsia-600" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-medium mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h2 className="text-3xl font-medium mt-2">{orderCount}</h2>
            </div>
            <div className="bg-fuchsia-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-fuchsia-600" />
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-fuchsia-600 text-sm font-medium flex items-center mt-4 hover:underline"
          >
            View all orders
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <h2 className="text-3xl font-medium mt-2">{pendingOrders}</h2>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <Link
            href="/admin/orders?status=pending"
            className="text-yellow-600 text-sm font-medium flex items-center mt-4 hover:underline"
          >
            View pending orders
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <h2 className="text-3xl font-medium mt-2">{customerCount}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            href="/admin/customers"
            className="text-blue-600 text-sm font-medium flex items-center mt-4 hover:underline"
          >
            View all customers
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/orders"
            className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-md flex items-center"
          >
            <Package className="h-5 w-5 mr-2 text-fuchsia-600" />
            Manage Orders
          </Link>
          <Link
            href="/admin/customers"
            className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-md flex items-center"
          >
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Manage Customers
          </Link>
        </div>
      </div>
    </div>
  )
}
