import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Heart, Gift, Sparkles } from "lucide-react"
import ProductShowcase from "@/components/product-showcase"
import FeaturedCollection from "@/components/featured-collection"
import TestimonialSection from "@/components/testimonial-section"
import NewsletterSection from "@/components/newsletter-section"
import UniqueCandles from "@/components/unique-candles"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section - Full height with parallax effect */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/pink-candles-collection.jpeg"
            alt="Luxury handcrafted pink candles collection"
            fill
            priority
            className="object-cover scale-105 transition-transform duration-10000 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div
              className="inline-block bg-fuchsia-600/80 px-4 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-sm animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Artisanal Candle Creations
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light mb-6 tracking-tight">
              <span
                className="block opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
              >
                Art You Can
              </span>
              <span
                className="block opacity-0 animate-fade-in-up font-medium"
                style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
              >
                <span className="text-fuchsia-300">Light</span> & Experience
              </span>
            </h1>
            <p
              className="text-lg md:text-xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              Discover our collection of sculptural candles that transform your space and express your unique style.
            </p>
            <div
              className="mt-8 flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}
            >
              <Link
                href="/products"
                className="bg-fuchsia-600 text-white hover:bg-fuchsia-700 px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all duration-300 group"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="border border-white text-white hover:bg-white hover:text-fuchsia-600 px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Floating features */}
        <div className="absolute bottom-12 left-0 right-0 z-10 hidden md:block">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white border border-white/20 transform hover:translate-y-[-5px] transition-transform">
                <div className="flex items-center">
                  <div className="bg-fuchsia-500/30 p-2 rounded-full mr-3">
                    <Heart className="h-5 w-5 text-fuchsia-200" />
                  </div>
                  <div>
                    <h3 className="font-medium">Express Your Love</h3>
                    <p className="text-xs text-white/80">Unique message candles</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white border border-white/20 transform hover:translate-y-[-5px] transition-transform">
                <div className="flex items-center">
                  <div className="bg-fuchsia-500/30 p-2 rounded-full mr-3">
                    <Gift className="h-5 w-5 text-fuchsia-200" />
                  </div>
                  <div>
                    <h3 className="font-medium">Perfect Gifts</h3>
                    <p className="text-xs text-white/80">Memorable & meaningful</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white border border-white/20 transform hover:translate-y-[-5px] transition-transform">
                <div className="flex items-center">
                  <div className="bg-fuchsia-500/30 p-2 rounded-full mr-3">
                    <Sparkles className="h-5 w-5 text-fuchsia-200" />
                  </div>
                  <div>
                    <h3 className="font-medium">Handcrafted</h3>
                    <p className="text-xs text-white/80">Made with love & care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Candles Showcase - New section */}
      <UniqueCandles />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Featured Collection */}
      <FeaturedCollection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Newsletter */}
      <NewsletterSection />
    </main>
  )
}
