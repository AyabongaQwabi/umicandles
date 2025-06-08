import OrderHistory from "@/components/order-history"

export const metadata = {
  title: "My Orders | Umi Candles",
  description: "View your order history and track your Umi Candles orders.",
}

export default function MyOrdersPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-medium mb-8">My Orders</h1>

        <div className="max-w-4xl mx-auto">
          <OrderHistory />
        </div>
      </div>
    </main>
  )
}
