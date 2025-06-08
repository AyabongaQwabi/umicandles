"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "@/hooks/use-toast"
import { products } from "@/config"

export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { addItem } = useCart()

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      },
      1,
    )

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    })
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Our Collection</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handcrafted candles made with premium ingredients and unique fragrances
          </p>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "all" ? "bg-fuchsia-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory("bestseller")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "bestseller"
                  ? "bg-fuchsia-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveCategory("new")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "new" ? "bg-fuchsia-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium">R{product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">
                        {product.category === "bestseller" ? "Best Seller" : "New"}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center bg-fuchsia-600 text-white py-2 rounded-md text-sm font-medium hover:bg-fuchsia-700 transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="inline-flex items-center text-fuchsia-600 font-medium hover:underline">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
