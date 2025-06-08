"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { products } from "@/config"

export default function UniqueCandles() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section ref={ref} className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-fuchsia-100 text-fuchsia-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Unique Designs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-6">
            Express Yourself With Candles
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our unique candle designs are perfect for expressing your feelings, celebrating special moments, or adding a
            personal touch to your space.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4">Say "I Love You" In A Unique Way</h3>
            <p className="text-gray-600 mb-6">
              Our signature "I LOVE YOU" candles are handcrafted with care to help you express your feelings in a
              beautiful and memorable way. Perfect for anniversaries, Valentine's Day, or just because.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-600 text-xs">1</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Personalized Messages</h4>
                  <p className="mt-1 text-sm text-gray-600">Custom text candles that speak from the heart</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-600 text-xs">2</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Sculptural Designs</h4>
                  <p className="mt-1 text-sm text-gray-600">Artistic shapes that double as home decor</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-600 text-xs">3</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Premium Quality</h4>
                  <p className="mt-1 text-sm text-gray-600">Long-lasting candles made with high-quality wax</p>
                </div>
              </div>
            </div>

            <Link
              href="/products/love-candles"
              className="inline-flex items-center text-fuchsia-600 font-medium hover:text-fuchsia-700 group"
            >
              Explore Love Candles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            style={{ y }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/pink-candles-collection.jpeg"
                alt="I LOVE YOU candles collection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block bg-fuchsia-600/80 px-3 py-1 rounded-full text-xs font-medium mb-2">
                  Featured Collection
                </span>
                <h3 className="text-xl font-medium">Sculptural Love Candles</h3>
                <p className="text-sm text-white/80">Express your feelings with our unique designs</p>
              </div>
            </div>

            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-2xl overflow-hidden shadow-lg border-4 border-white hidden md:block">
              <Image
                src="/pink-candles-collection.jpeg"
                alt="Close-up of I LOVE YOU candle"
                fill
                className="object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products
            .filter((p) => p.category === "bestseller")
            .slice(0, 3)
            .map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description.substring(0, 80)}...</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-medium">R{product.price.toFixed(2)}</span>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium flex items-center"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}
