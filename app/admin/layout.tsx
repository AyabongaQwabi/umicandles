import type { ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, Package, Users, LogOut } from "lucide-react"
import AdminAuthCheck from "@/components/admin/auth-check"

export const metadata = {
  title: "Admin Portal | Umi Candles",
  description: "Manage orders, customers, and products for Umi Candles.",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthCheck>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <Link href="/admin" className="font-serif text-xl font-medium">
              Umi Admin
            </Link>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors">
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/orders"
                  className="flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/customers"
                  className="flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Customers
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Link href="/admin/logout" className="flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
