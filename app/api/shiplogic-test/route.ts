import { NextResponse } from "next/server"
import { shiplogicService } from "@/lib/shiplogic-service"

export async function GET() {
  try {
    console.log("Testing Shiplogic API connection...")
    console.log("Base URL:", process.env.SHIPLOGIC_BASE_URL)
    console.log("API Key exists:", !!process.env.SHIPLOGIC_API_KEY)

    // Create a simple rate request to test the API connection using v2 format
    const rateRequest = {
      collection_address: {
        type: "business" as const,
        company: "Umi Candles",
        street_address: "123 Main Street",
        local_area: "Sandton",
        city: "Johannesburg",
        zone: "Gauteng",
        country: "ZA",
        code: "2196",
      },
      delivery_address: {
        type: "residential" as const,
        street_address: "456 Park Avenue",
        local_area: "Rosebank",
        city: "Johannesburg",
        zone: "Gauteng",
        country: "ZA",
        code: "2196",
      },
      parcels: [
        {
          submitted_length_cm: 30,
          submitted_width_cm: 20,
          submitted_height_cm: 15,
          submitted_weight_kg: 1,
          description: "Test Parcel",
        },
      ],
      declared_value: 500,
    }

    // Test the API connection by getting rates using v2 API
    console.log("Sending rate request to Shiplogic API...")
    const response = await shiplogicService.getRates(rateRequest)
    console.log("Received response from Shiplogic API:", response)

    return NextResponse.json({
      success: true,
      message: "Shiplogic API connection successful!",
      response: response,
      config: {
        baseUrl: process.env.SHIPLOGIC_BASE_URL,
        hasApiKey: !!process.env.SHIPLOGIC_API_KEY,
      },
    })
  } catch (error) {
    console.error("Shiplogic API test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Shiplogic API connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        config: {
          baseUrl: process.env.SHIPLOGIC_BASE_URL,
          hasApiKey: !!process.env.SHIPLOGIC_API_KEY,
        },
      },
      { status: 500 },
    )
  }
}
