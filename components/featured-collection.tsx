"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function FeaturedCollection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section ref={ref} className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <span className="text-sm font-medium text-fuchsia-600 uppercase tracking-wider">Featured Collection</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif font-medium">Fluted Candle Collection</h2>
            <p className="mt-4 text-gray-600">
              Our signature fluted candles are handcrafted with premium wax and feature an elegant ribbed design that
              creates beautiful light patterns when lit. Available in various sizes and colors, they're perfect for
              everyday decor or special occasions.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-600 text-xs">1</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Premium Materials</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Hand-poured using high-quality wax for a clean, long-lasting burn
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-600 text-xs">2</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Elegant Design</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Distinctive fluted texture that adds sophistication to any space
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fuchsia-100 flex items-center justify-center">
                  <span className="text-fuchsia-600 text-xs">3</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Perfect Gift</h4>
                  <p className="mt-1 text-sm text-gray-600">Our combo sets make thoughtful gifts for any occasion</p>
                </div>
              </div>
            </div>

            <button className="mt-8 bg-fuchsia-600 text-white px-6 py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors">
              Shop Fluted Collection
            </button>
          </motion.div>

          <motion.div style={{ y }} className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src="/pink-fluted-candle.jpeg" alt="Pink fluted candle" fill className="object-cover" />
              </div>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src="/lavender-candle.jpeg" alt="Lavender fluted candle" fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src="/purple-candle-set.jpeg" alt="Purple candle set" fill className="object-cover" />
              </div>
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src="/candle-with-vase.jpeg" alt="Candle with decorative vase" fill className="object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
