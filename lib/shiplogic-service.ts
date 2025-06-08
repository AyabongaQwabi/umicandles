// Shiplogic API Service for Umi Candles
// Based on Shiplogic v2 API

// Types for Shiplogic v2 API
export interface ShiplogicAddressV2 {
  type: "business" | "residential"
  company?: string
  street_address: string
  local_area: string
  city: string
  zone?: string
  country: string
  code: string
  lat?: number
  lng?: number
}

export interface ShiplogicContactV2 {
  name: string
  mobile_number?: string
  email: string
}

export interface ShiplogicParcelV2 {
  submitted_length_cm: number
  submitted_width_cm: number
  submitted_height_cm: number
  submitted_weight_kg: number
  parcel_description?: string
  reference?: string
}

export interface ShiplogicRateRequestV2 {
  collection_address: ShiplogicAddressV2
  delivery_address: ShiplogicAddressV2
  parcels: ShiplogicParcelV2[]
  declared_value?: number
  collection_min_date?: string // YYYY-MM-DD format
  delivery_min_date?: string // YYYY-MM-DD format
  opt_in_rates?: number[]
  opt_in_time_based_rates?: number[]
}

export interface ShiplogicServiceLevel {
  id: number
  code: string
  name: string
  description: string
  delivery_date_from: string
  delivery_date_to: string
  collection_date: string
  collection_cut_off_time: string
  vat_type: string
  insurance_disabled: boolean
}

export interface ShiplogicRateResponse {
  rate: number
  rate_excluding_vat: number
  base_rate: {
    charge_per_parcel: number[]
    charge: number
    group_name: string
    vat: number
    vat_type: string
    vat_percentage: number
    rate_formula_type: string
    total_calculated_weight: number
  }
  service_level: ShiplogicServiceLevel
  surcharges: any[]
  rate_adjustments: any[]
  time_based_rate_adjustments: any[]
  extras: any[]
  charged_weight: number
  actual_weight: number
  volumetric_weight: number
}

export interface ShiplogicRatesResponseV2 {
  message: string
  service_days: {
    collection_service_days: any
    delivery_service_days: any
  }
  rates: ShiplogicRateResponse[]
}

export interface ShiplogicShipmentRequestV2 {
  collection_address: ShiplogicAddressV2
  collection_contact: ShiplogicContactV2
  delivery_address: ShiplogicAddressV2
  delivery_contact: ShiplogicContactV2
  parcels: ShiplogicParcelV2[]
  service_level_code?: string
  service_level_id?: number
  declared_value?: number
  collection_min_date?: string
  collection_after?: string
  collection_before?: string
  delivery_min_date?: string
  delivery_after?: string
  delivery_before?: string
  special_instructions_collection?: string
  special_instructions_delivery?: string
  opt_in_rates?: number[]
  opt_in_time_based_rates?: number[]
  customer_reference?: string
  mute_notifications?: boolean
}

export interface ShiplogicShipmentResponseV2 {
  id: number
  short_tracking_reference: string
  customer_reference: string
  status: string
  collection_address: ShiplogicAddressV2
  delivery_address: ShiplogicAddressV2
  collection_contact: ShiplogicContactV2
  delivery_contact: ShiplogicContactV2
  parcels: ShiplogicParcelV2[]
  service_level_code: string
  service_level_name: string
  service_level_id: number
  rate: number
  tracking_events: any[]
  estimated_delivery_from: string
  estimated_delivery_to: string
}

// New interfaces for tracking
export interface ShiplogicTrackingEvent {
  id: number
  parcel_id: number
  date: string
  status: string
  source: string
  message: string
  lat?: number
  lng?: number
  data?: {
    department?: string
    images?: string[]
    mobile_number?: string
    name?: string
    pdfs?: {
      display_name: string
      file_name: string
    }[]
  }
  shipment_pods?: {
    id: number
    provider_id: number
    tracking_event_id: number
    shipment_id: number
    parcel_id: number
    date: string
    type: string
    filename: string
    display_name: string
    created_by: string
    time_created: string
    deleted_date: string
  }[]
}

export interface ShiplogicTrackingStep {
  step_number: number
  label: string
  progress: "done" | "current" | "pending"
}

export interface ShiplogicTrackingShipment {
  provider_id: number
  shipment_id: number
  short_tracking_reference: string
  status: string
  shipment_time_created: string
  shipment_time_modified: string
  shipment_collected_date: string | null
  shipment_delivered_date: string | null
  shipment_estimated_collection: string | null
  shipment_estimated_delivery_from: string | null
  shipment_estimated_delivery_to: string | null
  collection_from: string
  collection_hub: string
  delivery_hub: string
  service_level_code: string
  service_level_name: string
  tracking_events: ShiplogicTrackingEvent[]
}

export interface ShiplogicTrackingResponse {
  shipments: ShiplogicTrackingShipment[]
  tracking_steps: ShiplogicTrackingStep[]
}

export interface ShiplogicRate {
  id: string
  courier: {
    id: string
    name: string
    logo_url: string
  }
  service_level: {
    id: string
    name: string
    code: string
  }
  collection_min_date: string
  delivery_min_date: string
  delivery_max_date: string
  total: {
    amount: number
    currency: string
  }
  valid_until: string
}

// Main Shiplogic service class
export class ShiplogicService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.SHIPLOGIC_API_KEY || ""
    // Updated to v2 API
    this.baseUrl = (process.env.SHIPLOGIC_BASE_URL || "https://api.shiplogic.com").replace(/\/$/, "")

    if (!this.apiKey) {
      console.warn("Shiplogic API key not found. Set SHIPLOGIC_API_KEY environment variable.")
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // Ensure endpoint starts with a slash
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    const url = `${this.baseUrl}${path}`

    console.log(`Making request to: ${url}`)

    // Updated to use Bearer token authentication
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    }

    try {
      // Log the request details for debugging
      if (options.body) {
        console.log("Request body:", options.body)
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Log the response status
      console.log(`Response status: ${response.status} ${response.statusText}`)

      // If the response is not ok, handle the error
      if (!response.ok) {
        let errorMessage = `Shiplogic API error: ${response.status} ${response.statusText}`
        let errorDetails = ""

        // Try to get the response content type
        const contentType = response.headers.get("content-type") || ""
        console.log(`Response content type: ${contentType}`)

        // Handle different response types
        if (contentType.includes("application/json")) {
          try {
            const errorData = await response.json()
            errorDetails = JSON.stringify(errorData)
            console.error("API Error Response (JSON):", errorData)
          } catch (e) {
            console.error("Failed to parse JSON error response:", e)
          }
        } else {
          try {
            const errorText = await response.text()
            errorDetails = errorText
            console.error("API Error Response (Text):", errorText)
          } catch (e) {
            console.error("Failed to get error response text:", e)
          }
        }

        if (errorDetails) {
          errorMessage += ` - ${errorDetails}`
        }

        throw new Error(errorMessage)
      }

      // Check if the response is empty
      const responseText = await response.text()
      if (!responseText || responseText.trim() === "") {
        console.log("Empty response received")
        return {} // Return empty object for empty responses
      }

      // Try to parse the response as JSON
      try {
        return JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        console.log("Response text:", responseText)
        throw new Error(`Invalid JSON response: ${responseText}`)
      }
    } catch (error) {
      console.error("Shiplogic API request failed:", error)
      throw error
    }
  }

  // Get shipping rates using v2 API
  async getRates(request: ShiplogicRateRequestV2): Promise<ShiplogicRatesResponseV2> {
    try {
      // Validate the request
      this.validateRateRequest(request)

      // Updated to v2 endpoint
      return this.fetchWithAuth("/v2/rates", {
        method: "POST",
        body: JSON.stringify(request),
      })
    } catch (error) {
      console.error("Error in getRates:", error)
      throw error
    }
  }

  // Validate rate request to ensure required fields are present
  private validateRateRequest(request: ShiplogicRateRequestV2) {
    // Check collection address
    if (!request.collection_address) {
      throw new Error("Collection address is required")
    }

    if (!request.collection_address.street_address) {
      throw new Error("Collection street address is required")
    }

    if (!request.collection_address.city) {
      throw new Error("Collection city is required")
    }

    if (!request.collection_address.code) {
      throw new Error("Collection postal code is required")
    }

    // Check delivery address
    if (!request.delivery_address) {
      throw new Error("Delivery address is required")
    }

    if (!request.delivery_address.street_address) {
      throw new Error("Delivery street address is required")
    }

    if (!request.delivery_address.city) {
      throw new Error("Delivery city is required")
    }

    if (!request.delivery_address.code) {
      throw new Error("Delivery postal code is required")
    }

    // Check parcels
    if (!request.parcels || !request.parcels.length) {
      throw new Error("At least one parcel is required")
    }

    // Check parcel dimensions
    request.parcels.forEach((parcel, index) => {
      if (!parcel.submitted_length_cm) {
        throw new Error(`Parcel ${index + 1} length is required`)
      }

      if (!parcel.submitted_width_cm) {
        throw new Error(`Parcel ${index + 1} width is required`)
      }

      if (!parcel.submitted_height_cm) {
        throw new Error(`Parcel ${index + 1} height is required`)
      }

      if (!parcel.submitted_weight_kg) {
        throw new Error(`Parcel ${index + 1} weight is required`)
      }
    })
  }

  // Create a shipment using v2 API
  async createShipment(request: ShiplogicShipmentRequestV2): Promise<ShiplogicShipmentResponseV2> {
    // Updated to v2 endpoint
    return this.fetchWithAuth("/v2/shipments", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  // Get shipment details using v2 API
  async getShipment(shipmentId: number): Promise<ShiplogicShipmentResponseV2> {
    // Updated to v2 endpoint
    return this.fetchWithAuth(`/v2/shipments/${shipmentId}`)
  }

  // Track a shipment using v2 API
  async trackShipment(trackingReference: string): Promise<ShiplogicTrackingResponse> {
    // Updated to v2 endpoint with query parameter
    return this.fetchWithAuth(`/v2/tracking/shipments?tracking_reference=${trackingReference}`)
  }

  // Helper function to convert Umi Candles order to Shiplogic v2 rate request
  createRateRequestFromOrder(order: any): ShiplogicRateRequestV2 {
    // Default collection address (your warehouse/store)
    const collectionAddress: ShiplogicAddressV2 = {
      type: "business",
      company: "Umi Candles",
      street_address: "123 Main Street",
      local_area: "Sandton",
      city: "Johannesburg",
      zone: "Gauteng",
      country: "ZA", // Updated to use country code
      code: "2196",
    }

    // Create delivery address from order
    const deliveryAddress: ShiplogicAddressV2 = {
      type: "residential",
      street_address: order.shipping_address,
      local_area: order.shipping_suburb || "",
      city: order.shipping_city,
      zone: order.shipping_province || "",
      country: "ZA", // Default to South Africa
      code: order.shipping_postal_code,
    }

    // Create parcels from order items
    // This is a simplified example - you may need to adjust based on your products
    const parcels: ShiplogicParcelV2[] = [
      {
        submitted_length_cm: 30,
        submitted_width_cm: 20,
        submitted_height_cm: 15,
        submitted_weight_kg: 1, // Default weight, adjust as needed
        parcel_description: `Umi Candles Order #${order.order_number}`,
      },
    ]

    return {
      collection_address: collectionAddress,
      delivery_address: deliveryAddress,
      parcels: parcels,
      declared_value: order.total,
    }
  }
}

// Create a singleton instance
export const shiplogicService = new ShiplogicService()
