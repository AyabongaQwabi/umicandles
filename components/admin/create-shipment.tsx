"use client"

import type React from "react"

import { useState } from "react"
import { createShipment } from "@/app/actions/shipping-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Loader2, Package, Truck } from "lucide-react"

interface CreateShipmentProps {
  orderId: string
  orderNumber: string
}

export function CreateShipment({ orderId, orderNumber }: CreateShipmentProps) {
  const [loading, setLoading] = useState(false)
  const [serviceLevelCode, setServiceLevelCode] = useState("ECO") // Default to Economy
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
    trackingNumber?: string
    shipmentId?: number
    status?: string
    estimatedDelivery?: {
      from: string
      to: string
    }
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await createShipment(orderId, serviceLevelCode)
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

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-ZA", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Create Shipment for Order #{orderNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceLevel">Shipping Service</Label>
            <Select value={serviceLevelCode} onValueChange={setServiceLevelCode} required>
              <SelectTrigger id="serviceLevel">
                <SelectValue placeholder="Select shipping service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ECO">Economy (2-3 days)</SelectItem>
                <SelectItem value="LOF">Local Overnight Flyer</SelectItem>
                <SelectItem value="LSF">Local Sameday Flyer</SelectItem>
                <SelectItem value="LSE">Local Same Day Economy</SelectItem>
                <SelectItem value="LSX">Local Sameday Express</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Shipment...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" /> Create Shipment
              </>
            )}
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
              <p className="font-medium">{result.success ? result.message : result.error}</p>
              {result.trackingNumber && (
                <p className="mt-1">
                  Tracking #: <span className="font-medium">{result.trackingNumber}</span>
                </p>
              )}
              {result.status && <p className="mt-1">Status: {result.status}</p>}
              {result.estimatedDelivery && (
                <p className="mt-1">
                  Estimated Delivery: {formatDate(result.estimatedDelivery.from)} -{" "}
                  {formatDate(result.estimatedDelivery.to)}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
