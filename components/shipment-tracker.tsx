"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, Info } from "lucide-react"
import { trackShipment } from "@/app/actions/tracking-actions"
import type { ShiplogicTrackingResponse } from "@/lib/shiplogic-service"

export default function ShipmentTracker() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingInfo, setTrackingInfo] = useState<ShiplogicTrackingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await trackShipment(trackingNumber.trim())

      if (result.success && result.data) {
        setTrackingInfo(result.data)
      } else {
        setError(result.error || "Failed to track shipment")
        setTrackingInfo(null)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
      setTrackingInfo(null)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "awaiting-dropoff":
        return <Package className="h-5 w-5 text-blue-500" />
      case "collection-exception":
      case "collection-failed-attempt":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "collected":
        return <Package className="h-5 w-5 text-green-500" />
      case "at-hub":
      case "at-destination-hub":
        return <MapPin className="h-5 w-5 text-purple-500" />
      case "in-transit":
        return <Truck className="h-5 w-5 text-amber-500" />
      case "out-for-delivery":
        return <Truck className="h-5 w-5 text-green-500" />
      case "delivery-exception":
      case "delivery-failed-attempt":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
      case "awaiting-dropoff":
        return "bg-blue-100 text-blue-800"
      case "collection-exception":
      case "collection-failed-attempt":
      case "delivery-exception":
      case "delivery-failed-attempt":
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "collected":
      case "delivered":
        return "bg-green-100 text-green-800"
      case "at-hub":
      case "at-destination-hub":
        return "bg-purple-100 text-purple-800"
      case "in-transit":
      case "out-for-delivery":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Track Your Shipment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number (e.g. G9G)"
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Tracking..." : "Track"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {trackingInfo && trackingInfo.shipments && trackingInfo.shipments.length > 0 && (
            <div className="mt-6">
              {trackingInfo.shipments.map((shipment, index) => (
                <div key={index} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Tracking #{shipment.short_tracking_reference}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          shipment.status,
                        )}`}
                      >
                        {shipment.status.replace(/-/g, " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-gray-500">Service</p>
                        <p className="font-medium">
                          {shipment.service_level_name} ({shipment.service_level_code})
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="font-medium">{formatDate(shipment.shipment_time_created)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Collection</p>
                        <p className="font-medium">{shipment.collection_from}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estimated Delivery</p>
                        <p className="font-medium">
                          {shipment.shipment_estimated_delivery_from
                            ? `${formatDate(shipment.shipment_estimated_delivery_from)} - ${formatDate(
                                shipment.shipment_estimated_delivery_to,
                              )}`
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="p-4 border-b">
                    <h4 className="font-medium mb-4">Tracking Progress</h4>
                    <div className="relative">
                      {/* Progress Bar */}
                      <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200">
                        <div
                          className="h-full bg-fuchsia-600"
                          style={{
                            width: `${
                              (trackingInfo.tracking_steps.findIndex((step) => step.progress === "current") /
                                (trackingInfo.tracking_steps.length - 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>

                      {/* Status Steps */}
                      <div
                        className="grid relative"
                        style={{ gridTemplateColumns: `repeat(${trackingInfo.tracking_steps.length}, 1fr)` }}
                      >
                        {trackingInfo.tracking_steps.map((step, i) => (
                          <div key={i} className="text-center">
                            <div
                              className={`h-10 w-10 rounded-full ${
                                step.progress === "done" || step.progress === "current"
                                  ? "bg-fuchsia-600 text-white"
                                  : "bg-gray-200 text-gray-400"
                              } flex items-center justify-center mx-auto z-10`}
                            >
                              {step.progress === "current" ? (
                                <Clock className="h-5 w-5" />
                              ) : step.progress === "done" ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <span>{step.step_number}</span>
                              )}
                            </div>
                            <p className="mt-2 text-sm font-medium capitalize">{step.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tracking Events */}
                  <div className="p-4">
                    <h4 className="font-medium mb-4">Tracking History</h4>
                    <div className="space-y-4">
                      {shipment.tracking_events
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((event, i) => (
                          <div key={i} className="relative pl-6 pb-4">
                            {i !== shipment.tracking_events.length - 1 && (
                              <div className="absolute top-0 left-[10px] h-full w-0.5 bg-gray-200"></div>
                            )}
                            <div className="absolute top-0 left-0 rounded-full bg-white">
                              {getStatusIcon(event.status)}
                            </div>
                            <div className="ml-4">
                              <p className="font-medium capitalize">{event.status.replace(/-/g, " ")}</p>
                              {event.message && <p className="text-sm text-gray-600">{event.message}</p>}
                              {event.data && event.data.name && (
                                <p className="text-sm text-gray-600">
                                  Received by: {event.data.name}
                                  {event.data.department && ` (${event.data.department})`}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">{formatDate(event.date)}</p>

                              {/* POD Images */}
                              {event.data && event.data.images && event.data.images.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-gray-500">Proof of Delivery Images</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {event.data.images.map((image, imgIndex) => (
                                      <div
                                        key={imgIndex}
                                        className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center"
                                      >
                                        <Package className="h-6 w-6 text-gray-400" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!trackingInfo && !error && !loading && (
            <div className="mt-6 text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Enter your tracking number to see shipment status</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
