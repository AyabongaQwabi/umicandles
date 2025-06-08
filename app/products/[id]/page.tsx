"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { toast } from "@/hooks/use-toast"
import { products } from "@/config"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { addItem } = useCart()

  // Find the product based on the ID from the URL
  const product = products.find((p) => p.id === Number(productId))

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!product) {
      router.push("/products")
    }
  }, [product, router])

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/products"
            className="bg-fuchsia-600 text-white px-6 py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    )

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    })
  }

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
    )

    router.push("/cart")
  }

  // Get related products
  const relatedProducts = product.related
    ? product.related.map((id) => products.find((p) => p.id === id)).filter(Boolean)
    : []

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products" className="text-gray-600 hover:text-gray-900 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative rounded-md overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-fuchsia-600" : "ring-1 ring-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-serif font-medium mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-medium">R{product.price.toFixed(2)}</span>
              {product.category === "bestseller" && (
                <span className="ml-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Best Seller</span>
              )}
              {product.category === "new" && (
                <span className="ml-3 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">New</span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Scent</h3>
              <p className="text-gray-700">{product.scent}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <p className="text-gray-700">{product.size}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-fuchsia-600 text-white py-3 px-6 rounded-full font-medium hover:bg-fuchsia-700 transition-colors flex items-center justify-center"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 border border-fuchsia-600 text-fuchsia-600 py-3 px-6 rounded-full font-medium hover:bg-fuchsia-50 transition-colors flex items-center justify-center"
              >
                Buy Now
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-medium mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="group">
                  <Link href={`/products/${relatedProduct.id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                      <div className="aspect-square relative">
                        <Image
                          src={relatedProduct.images[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg">{relatedProduct.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{relatedProduct.scent}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-medium">R{relatedProduct.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
