import Link from "next/link"
import { Facebook, Instagram, Twitter, Package } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-2xl font-medium">
              Umi Candles
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Handcrafted luxury candles for life's meaningful celebrations and everyday serenity.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-fuchsia-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-fuchsia-400 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-fuchsia-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products/bestsellers" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/products/new" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products/gifts" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-400 hover:text-fuchsia-400 transition-colors flex items-center"
                >
                  <Package className="h-4 w-4 mr-1" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Candle Care
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Umi Candles. All rights reserved.</p>
          <Link
            href="/admin"
            className="text-gray-500 hover:text-fuchsia-400 transition-colors text-xs inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 mr-1"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  )
}
