import ShipmentTracker from "@/components/shipment-tracker"

export default function TrackingPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-6 text-center">Track Your Shipment</h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your tracking number below to get real-time updates on your shipment.
          </p>

          <ShipmentTracker />

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Tracking Information</h2>
            <p className="text-gray-600 mb-4">
              Your tracking number can be found in your order confirmation email or on your order details page.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">What do the different statuses mean?</h3>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>
                    <span className="font-medium">Submitted</span> - Your order has been received and is being processed
                  </li>
                  <li>
                    <span className="font-medium">Collected</span> - Your package has been picked up from our warehouse
                  </li>
                  <li>
                    <span className="font-medium">In Transit</span> - Your package is on its way to you
                  </li>
                  <li>
                    <span className="font-medium">Out for Delivery</span> - Your package is out for delivery today
                  </li>
                  <li>
                    <span className="font-medium">Delivered</span> - Your package has been delivered
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Need help?</h3>
                <p className="mt-2 text-sm text-gray-600">
                  If you have any questions about your shipment, please contact our customer support team at{" "}
                  <a href="mailto:support@umicandles.com" className="text-fuchsia-600 hover:underline">
                    support@umicandles.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
