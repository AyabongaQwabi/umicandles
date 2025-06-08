"use client"

import type React from "react"

import { useState } from "react"
import { createShipment } from "@/app/actions/shipping-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Check, AlertCircle } from "lucide-react"

export default function AdminShipmentsPage() {
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
    trackingNumber?: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await createShipment(orderId)
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Shipment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter order ID"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Shipment..." : "Create Shipment"}
              </Button>
            </form>

            {result && (
              <div
                className={`mt-4 p-3 rounded-md flex items-start ${
                  result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {result.success ? (
                  <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p>{result.success ? result.message : result.error}</p>
                  {result.trackingNumber && <p className="mt-1 font-medium">Tracking #: {result.trackingNumber}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
          <Package className="h-16 w-16 text-fuchsia-500 mb-4" />
          <h2 className="text-xl font-medium mb-2">Shiplogic Integration</h2>
          <p className="text-gray-600 mb-4">
            Create shipments, generate labels, and track packages with Shiplogic's shipping API.
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2 w-full">
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>Get shipping rates from multiple couriers</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>Create shipments and generate waybills</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>Track packages in real-time</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
              <span>Manage all your shipments in one place</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
