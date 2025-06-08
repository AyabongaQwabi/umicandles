"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1000)
  }

  return (
    <section className="py-16 md:py-24 bg-fuchsia-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Join Our Community</h2>
            <p className="text-fuchsia-100 mb-8">
              Subscribe to our newsletter for exclusive offers, candle care tips, and early access to new collections.
            </p>

            {isSubmitted ? (
              <div className="bg-fuchsia-800 rounded-lg p-6 inline-flex items-center">
                <div className="bg-fuchsia-500 rounded-full p-2 mr-3">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <p>Thank you for subscribing! Check your email for a special welcome gift.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-full bg-fuchsia-800 border border-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 text-white"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-full bg-white text-fuchsia-900 font-medium hover:bg-gray-100 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}

            <p className="mt-4 text-sm text-fuchsia-200">We respect your privacy. Unsubscribe at any time.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
