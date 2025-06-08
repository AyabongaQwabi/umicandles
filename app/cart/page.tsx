"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, itemCount, subtotal } = useCart()

  // Default shipping cost
  const shipping = subtotal > 0 ? 50 : 0

  // Calculate total with null checks
  const total = (subtotal || 0) + shipping

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-medium mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <ShoppingBag className="h-full w-full" />
            </div>
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-fuchsia-600 text-white px-6 py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors inline-flex items-center"
              >
                Shop Products
              </Link>
              <Link
                href="/event-planning"
                className="border border-fuchsia-600 text-fuchsia-600 px-6 py-3 rounded-full font-medium hover:bg-fuchsia-50 transition-colors inline-flex items-center"
              >
                Book Event Planning
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.product.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden relative">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium">{item.product.name}</h3>
                          <p className="font-medium">R{((item.product.price || 0) * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="text-gray-600 mt-1">R{(item.product.price || 0).toFixed(2)} each</p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="mx-3 w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-gray-200">
                  <Link href="/products" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R{(subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>R{shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-fuchsia-600 text-white py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors mt-6"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-xs">Visa</div>
                    <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-xs">MC</div>
                    <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-xs">Amex</div>
                    <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center text-xs">Yoco</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
