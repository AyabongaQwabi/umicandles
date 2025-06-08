import { supabase, isSupabaseInitialized, type Order, type OrderStatus } from "./supabase"

// Interface for customer with order count
export interface CustomerWithOrderCount {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  created_at: string
  order_count: number
}

// Get all orders with pagination
export async function getAllOrders(
  page = 1,
  limit = 10,
  status?: OrderStatus,
): Promise<{ data: Order[] | null; count: number; error: any }> {
  try {
    if (!isSupabaseInitialized()) {
      return { data: null, count: 0, error: new Error("Supabase client not initialized") }
    }

    // Build query
    let query = supabase.from("orders").select("*", { count: "exact" })

    // Add status filter if provided
    if (status) {
      query = query.eq("status", status)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Execute query
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to)

    if (error) {
      console.error("Error fetching orders:", error)
      return { data: null, count: 0, error }
    }

    return { data, count: count || 0, error: null }
  } catch (error) {
    console.error("Exception in getAllOrders:", error)
    return { data: null, count: 0, error }
  }
}

// Get a single order by ID
export async function getOrderById(orderId: string): Promise<{ data: Order | null; error: any }> {
  try {
    if (!isSupabaseInitialized()) {
      return { data: null, error: new Error("Supabase client not initialized") }
    }

    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      console.error("Error fetching order:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Exception in getOrderById:", error)
    return { data: null, error }
  }
}

// Update order status - Fixed to properly update the status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ success: boolean; error: any }> {
  try {
    if (!isSupabaseInitialized()) {
      return { success: false, error: new Error("Supabase client not initialized") }
    }

    console.log(`Updating order ${orderId} status to ${status}`)

    // Use upsert with onConflict to ensure the update works
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) {
      console.error("Error updating order status:", error)
      return { success: false, error }
    }

    console.log(`Successfully updated order ${orderId} status to ${status}`)
    return { success: true, error: null }
  } catch (error) {
    console.error("Exception in updateOrderStatus:", error)
    return { success: false, error }
  }
}

// Get all customers with order counts
export async function getAllCustomers(
  page = 1,
  limit = 10,
): Promise<{ data: CustomerWithOrderCount[] | null; count: number; error: any }> {
  try {
    if (!isSupabaseInitialized()) {
      return { data: null, count: 0, error: new Error("Supabase client not initialized") }
    }

    // First get customers
    const from = (page - 1) * limit
    const to = from + limit - 1

    const {
      data: customers,
      error: customersError,
      count,
    } = await supabase
      .from("customers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (customersError) {
      console.error("Error fetching customers:", customersError)
      return { data: null, count: 0, error: customersError }
    }

    if (!customers || customers.length === 0) {
      return { data: [], count: 0, error: null }
    }

    // Get order counts for each customer
    const customersWithCounts: CustomerWithOrderCount[] = await Promise.all(
      customers.map(async (customer) => {
        const { count: orderCount, error: countError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("customer_email", customer.email)

        if (countError) {
          console.error(`Error getting order count for customer ${customer.email}:`, countError)
          return { ...customer, order_count: 0 }
        }

        return { ...customer, order_count: orderCount || 0 }
      }),
    )

    return { data: customersWithCounts, count: count || 0, error: null }
  } catch (error) {
    console.error("Exception in getAllCustomers:", error)
    return { data: null, count: 0, error }
  }
}

// Get customer details with orders
export async function getCustomerWithOrders(
  customerId: string,
): Promise<{ customer: any; orders: Order[] | null; error: any }> {
  try {
    if (!isSupabaseInitialized()) {
      return {
        customer: null,
        orders: null,
        error: new Error("Supabase client not initialized"),
      }
    }

    // Get customer details
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single()

    if (customerError) {
      console.error("Error fetching customer:", customerError)
      return { customer: null, orders: null, error: customerError }
    }

    // Get customer orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", customer.email)
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error fetching customer orders:", ordersError)
      return { customer, orders: null, error: ordersError }
    }

    return { customer, orders, error: null }
  } catch (error) {
    console.error("Exception in getCustomerWithOrders:", error)
    return { customer: null, orders: null, error }
  }
}
