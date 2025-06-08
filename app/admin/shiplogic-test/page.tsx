"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function ShiplogicTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/shiplogic-test")
      const data = await response.json()

      setTestResult(data)

      if (!data.success) {
        setError(data.message || "API test failed")
      }
    } catch (err) {
      console.error("Error testing Shiplogic API:", err)
      setError("Failed to test API connection")
      setTestResult(null)
    } finally {
      setLoading(false)
    }
  }

  // Run the test when the page loads
  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Shiplogic API Test</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            This page tests your connection to the Shiplogic API using your environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {loading ? (
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin mr-3" />
              ) : testResult?.success ? (
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              )}

              <div>
                {loading ? (
                  <p className="font-medium">Testing API connection...</p>
                ) : testResult?.success ? (
                  <p className="font-medium text-green-600">Connection successful!</p>
                ) : (
                  <p className="font-medium text-red-600">Connection failed</p>
                )}

                {!loading && testResult?.message && <p className="text-sm text-gray-600 mt-1">{testResult.message}</p>}

                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              </div>
            </div>

            <Button onClick={testConnection} disabled={loading} variant="outline" size="sm">
              {loading ? "Testing..." : "Test Again"}
            </Button>
          </div>

          {testResult?.success && testResult?.rates && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Available Shipping Rates</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-80">
                <pre className="text-xs">{JSON.stringify(testResult.rates, null, 2)}</pre>
              </div>
            </div>
          )}

          {!testResult?.success && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="text-sm font-medium text-amber-800 mb-2">Troubleshooting Tips:</h3>
              <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                <li>Verify that your SHIPLOGIC_API_KEY is correct</li>
                <li>
                  Check that SHIPLOGIC_BASE_URL is set to the correct endpoint (usually https://api.shiplogic.com/v1)
                </li>
                <li>Ensure your Shiplogic account is active and has API access</li>
                <li>Check your network settings to ensure your server can reach the Shiplogic API</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-fuchsia-500" />
              Shipping Rate Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test the shipping rate calculator component on your checkout page.
            </p>
            <Button asChild className="w-full">
              <a href="/checkout">Go to Checkout</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-fuchsia-500" />
              Shipment Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test the shipment tracking component on your order tracking page.
            </p>
            <Button asChild className="w-full">
              <a href="/track-order">Go to Tracking</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-fuchsia-500" />
              Admin Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Test creating shipments from the admin shipments page.</p>
            <Button asChild className="w-full">
              <a href="/admin/shipments">Go to Admin</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
