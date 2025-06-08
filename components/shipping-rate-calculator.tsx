"use client"

import type React from "react"

import { useState } from "react"
import { getShippingRates } from "@/app/actions/shipping-actions"
import type { ShiplogicRate } from "@/lib/shiplogic-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Truck, Clock, AlertCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function ShippingRateCalculator() {
  const { items } = useCart()
  const [rates, setRates] = useState<ShiplogicRate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRate, setSelectedRate] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    // Add cart items to form data
    if (items && items.length > 0) {
      const cartItemsFormatted = items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }))
      formData.append("cartItems", JSON.stringify(cartItemsFormatted))
    }

    try {
      const result = await getShippingRates(formData)

      if (result.success && result.rates) {
        setRates(result.rates)
        // Auto-select the cheapest rate
        if (result.rates.length > 0) {
          const cheapestRate = result.rates.reduce((prev, current) =>
            prev.total.amount < current.total.amount ? prev : current,
          )
          setSelectedRate(cheapestRate.id)
        }
      } else {
        setError(result.error || "Failed to get shipping rates")
        setRates([])
      }
    } catch (err) {
      console.error("Error getting shipping rates:", err)
      setError("An error occurred while calculating shipping rates. Please try again later or contact support.")
      setRates([])
    } finally {
      setLoading(false)
    }
  }

  const handleRateSelect = (rateId: string) => {
    setSelectedRate(rateId)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Calculate Shipping</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" name="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select name="country" defaultValue="South Africa">
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Namibia">Namibia</SelectItem>
                    <SelectItem value="Botswana">Botswana</SelectItem>
                    <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Calculating..." : "Calculate Shipping"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {error && rates.length === 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Estimated Shipping Options</h3>
              <p className="text-sm text-gray-600 mb-4">
                We're currently experiencing issues with our shipping calculator. Here are our standard shipping
                options:
              </p>
              <div className="space-y-3">
                <div className="border rounded-md p-4 cursor-pointer transition-colors border-fuchsia-500 bg-fuchsia-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative flex-shrink-0 bg-white p-1 rounded border">
                        <Truck className="w-full h-full text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Standard Delivery</h4>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R75.00</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4 cursor-pointer transition-colors border-gray-200 hover:border-fuchsia-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 relative flex-shrink-0 bg-white p-1 rounded border">
                        <Truck className="w-full h-full text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Express Delivery</h4>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R150.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {rates.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Available Shipping Options</h3>
              <div className="space-y-3">
                {rates.map((rate) => (
                  <div
                    key={rate.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${
                      selectedRate === rate.id
                        ? "border-fuchsia-500 bg-fuchsia-50"
                        : "border-gray-200 hover:border-fuchsia-300"
                    }`}
                    onClick={() => handleRateSelect(rate.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 relative flex-shrink-0 bg-white p-1 rounded border">
                          {rate.courier.logo_url ? (
                            <Image
                              src={rate.courier.logo_url || "/placeholder.svg"}
                              alt={rate.courier.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <Truck className="w-full h-full text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{rate.courier.name}</h4>
                          <p className="text-sm text-gray-600">{rate.service_level.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R{rate.total.amount.toFixed(2)}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(rate.delivery_min_date).toLocaleDateString()} -{" "}
                            {new Date(rate.delivery_max_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
