"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Filter, ArrowUpDown, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "@/hooks/use-toast"
import { products } from "@/config"

export function ProductsClient() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortOption, setSortOption] = useState("featured")
  const { addItem } = useCart()

  const filteredProducts =
    activeFilter === "all" ? products : products.filter((product) => product.category === activeFilter)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") {
      return a.price - b.price
    } else if (sortOption === "price-high") {
      return b.price - a.price
    }
    // Default: featured
    return 0
  })

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      1,
    )

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    })
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-12">
          <Image src="/umi-candles-colorful.jpeg" alt="Our Collection" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-2">Our Collection</h1>
              <p className="text-lg md:text-xl">Handcrafted with love and care</p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filter by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeFilter === "all"
                    ? "bg-fuchsia-600 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("bestseller")}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeFilter === "bestseller"
                    ? "bg-fuchsia-600 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveFilter("new")}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeFilter === "new"
                    ? "bg-fuchsia-600 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            <span className="font-medium">Sort by:</span>
            <select
              className="px-3 py-1 text-sm rounded-full bg-white border border-gray-200 focus:outline-none"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.category === "bestseller" && (
                      <div className="absolute top-2 left-2 bg-fuchsia-500 text-white text-xs px-2 py-1 rounded-full">
                        Best Seller
                      </div>
                    )}
                    {product.category === "new" && (
                      <div className="absolute top-2 left-2 bg-fuchsia-700 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium">R{product.price.toFixed(2)}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full flex items-center justify-center bg-fuchsia-600 text-white py-2 rounded-md text-sm font-medium hover:bg-fuchsia-700 transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function ProductsPage() {
  return <ProductsClient />
}
