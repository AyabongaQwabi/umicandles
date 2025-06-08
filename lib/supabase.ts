import { createClient } from "@supabase/supabase-js"

// These would typically come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"

// Create a singleton instance of the Supabase client with better error handling
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Don't persist session in browser storage
  },
})

// Add a function to check if Supabase is properly initialized
export function isSupabaseInitialized(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== "https://example.supabase.co" &&
      supabaseKey !== "your-supabase-anon-key",
  )
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  items: {
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }[]
  event_booking?: {
    date: string
    location: string
    eventType: string
    guestCount: number
    additionalInfo: string
    price: number
  } | null
  subtotal: number
  shipping_cost: number
  total: number
  payment_id?: string
  status: OrderStatus
  created_at: string
  updated_at: string
  tracking_number?: string
  estimated_delivery?: string
  notes?: string
}

// Generate a human-readable order ID
export function generateOrderNumber(): string {
  const prefix = "UMI"
  const timestamp = new Date().getTime().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}-${timestamp}-${random}`
}

// Save order to Supabase with better error handling
export async function saveOrder(
  order: Omit<Order, "id" | "created_at" | "updated_at">,
): Promise<{ data: Order | null; error: any }> {
  try {
    // Check if Supabase is properly initialized
    if (!isSupabaseInitialized()) {
      console.error("Supabase client not properly initialized - using fallback")
      saveOrderToLocalStorage(order)
      return {
        data: {
          ...order,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Order,
        error: null,
      }
    }

    console.log("Attempting to save order to Supabase:", { orderNumber: order.order_number })

    // Try to save the order
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...order,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase insertion error:", error)
      // Save to localStorage as fallback
      saveOrderToLocalStorage(order)
      return {
        data: {
          ...order,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Order,
        error,
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Exception in saveOrder:", error)
    // Save to localStorage as fallback
    saveOrderToLocalStorage(order)
    return {
      data: {
        ...order,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Order,
      error,
    }
  }
}

// Get order by order number using the new database function
export async function getOrderByNumber(orderNumber: string): Promise<{ data: Order | null; error: any }> {
  try {
    // Check if Supabase is properly initialized
    if (!isSupabaseInitialized()) {
      console.error("Supabase client not initialized")
      const localOrder = getOrderFromLocalStorage(orderNumber)
      return {
        data: localOrder,
        error: localOrder ? null : new Error("Database client not initialized"),
      }
    }

    // Try to get the order using the new function
    const { data, error } = await supabase.rpc("get_order_by_number", { order_num: orderNumber }).single()

    if (error) {
      console.error("Supabase error:", error)

      // Try direct query as fallback
      const { data: directData, error: directError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single()

      if (directError) {
        // Try localStorage as final fallback
        const localOrder = getOrderFromLocalStorage(orderNumber)
        return { data: localOrder, error: directError }
      }

      return { data: directData, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getOrderByNumber:", error)
    // Try localStorage as fallback
    const localOrder = getOrderFromLocalStorage(orderNumber)
    return { data: localOrder, error }
  }
}

// Get orders by customer email
export async function getOrdersByEmail(email: string): Promise<{ data: Order[] | null; error: any }> {
  try {
    // Check if Supabase is properly initialized
    if (!isSupabaseInitialized()) {
      console.error("Supabase client not initialized")
      return { data: null, error: new Error("Database client not initialized") }
    }

    // Try to get orders using the new function
    const { data, error } = await supabase.rpc("get_orders_by_email", { customer_email: email })

    if (error) {
      console.error("Supabase error:", error)

      // Try direct query as fallback
      const { data: directData, error: directError } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", email)
        .order("created_at", { ascending: false })

      if (directError) {
        return { data: null, error: directError }
      }

      return { data: directData, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getOrdersByEmail:", error)
    return { data: null, error }
  }
}

// Update order status with better error handling
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ success: boolean; error: any }> {
  try {
    // Check if Supabase is properly initialized
    if (!isSupabaseInitialized()) {
      console.error("Supabase client not initialized")
      return { success: false, error: new Error("Database client not initialized") }
    }

    // Try to update the order
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Error in updateOrderStatus:", error)
    return { success: false, error }
  }
}

// Fallback function to save order to localStorage when Supabase fails
export function saveOrderToLocalStorage(order: Omit<Order, "id" | "created_at" | "updated_at">): void {
  try {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    orders.push({
      ...order,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    localStorage.setItem("orders", JSON.stringify(orders))
  } catch (error) {
    console.error("Error saving order to localStorage:", error)
  }
}

// Get order from localStorage by order number
export function getOrderFromLocalStorage(orderNumber: string): Order | null {
  try {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    return orders.find((order: Order) => order.order_number === orderNumber) || null
  } catch (error) {
    console.error("Error getting order from localStorage:", error)
    return null
  }
}

// Get customer by email
export async function getCustomerByEmail(email: string): Promise<{ data: any; error: any }> {
  try {
    // Check if Supabase is properly initialized
    if (!isSupabaseInitialized()) {
      console.error("Supabase client not initialized")
      return { data: null, error: new Error("Database client not initialized") }
    }

    const { data, error } = await supabase.from("customers").select("*").eq("email", email).single()

    if (error) {
      console.error("Supabase error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error in getCustomerByEmail:", error)
    return { data: null, error }
  }
}
