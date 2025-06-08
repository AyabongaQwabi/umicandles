"use server"

import { shiplogicService } from "@/lib/shiplogic-service"
import type { ShiplogicTrackingResponse } from "@/lib/shiplogic-service"

export async function trackShipment(trackingNumber: string): Promise<{
  success: boolean
  data?: ShiplogicTrackingResponse
  error?: string
}> {
  try {
    if (!trackingNumber || trackingNumber.trim() === "") {
      return {
        success: false,
        error: "Please provide a valid tracking number",
      }
    }

    console.log(`Tracking shipment with reference: ${trackingNumber}`)
    const trackingData = await shiplogicService.trackShipment(trackingNumber.trim())

    if (!trackingData || !trackingData.shipments || trackingData.shipments.length === 0) {
      return {
        success: false,
        error: "No shipment found with this tracking number",
      }
    }

    return {
      success: true,
      data: trackingData,
    }
  } catch (error) {
    console.error("Error tracking shipment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred while tracking the shipment",
    }
  }
}
