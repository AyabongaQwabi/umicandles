export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-medium mb-2">Processing Your Payment</h2>
        <p className="text-gray-600">Please wait while we verify your payment status...</p>
      </div>
    </div>
  )
}
