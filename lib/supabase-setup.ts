/**
 * This file contains helper functions for setting up and initializing your Supabase database.
 * You can use these functions to seed your database with initial data or verify the schema.
 */

import { supabase } from "./supabase"

/**
 * Seed the products table with initial data
 */
export async function seedProducts() {
  const products = [
    {
      name: "Fluted Pillar Candle - 12 cm",
      description: "Elegant fluted pillar candle, perfect for everyday decor",
      price: 150.0,
      image: "/pink-fluted-candle.jpeg",
      category: "bestseller",
      size: "12 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "30-hour burn time",
        "Cotton wick",
        "Elegant fluted design",
        "12 cm height",
      ]),
      scent: "Unscented",
    },
    {
      name: "Fluted Pillar Candle - 6 cm",
      description: "Small fluted pillar candle, ideal for accent lighting",
      price: 100.0,
      image: "/small-pink-candles.jpeg",
      category: "bestseller",
      size: "6 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "15-hour burn time",
        "Cotton wick",
        "Elegant fluted design",
        "6 cm height",
      ]),
      scent: "Unscented",
    },
    {
      name: "Fluted Pillar Candle - 26 cm",
      description: "Large statement fluted pillar candle for special occasions",
      price: 220.0,
      image: "/purple-candle-set.jpeg",
      category: "new",
      size: "26 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "60-hour burn time",
        "Cotton wick",
        "Elegant fluted design",
        "26 cm height",
      ]),
      scent: "Unscented",
    },
    {
      name: "Fluted Pillar Candle - 30 cm",
      description: "Extra large fluted pillar candle, makes a stunning centerpiece",
      price: 280.0,
      image: "/green-candles.jpeg",
      category: "new",
      size: "30 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "80-hour burn time",
        "Cotton wick",
        "Elegant fluted design",
        "30 cm height",
      ]),
      scent: "Unscented",
    },
    {
      name: "Premium Fluted Candle - 6 cm",
      description: "Premium small fluted candle in lavender, made with luxury wax blend",
      price: 160.0,
      image: "/lavender-candle.jpeg",
      category: "bestseller",
      size: "6 cm",
      details: JSON.stringify([
        "Hand-poured luxury wax blend",
        "20-hour burn time",
        "Premium cotton wick",
        "Elegant fluted design",
        "6 cm height",
      ]),
      scent: "Unscented",
    },
    {
      name: "Pumpkin Shaped Candle",
      description: "Seasonal pumpkin shaped candle, perfect for autumn decor",
      price: 180.0,
      image: "/pumpkin-candle.jpeg",
      category: "new",
      size: "8 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "25-hour burn time",
        "Cotton wick",
        "Unique pumpkin design",
        "8 cm height",
      ]),
      scent: "Unscented",
    },
    {
      name: "Combo Set - 12 cm & 26 cm",
      description: "Perfect pair of fluted candles in complementary colors",
      price: 480.0,
      image: "/candle-with-vase.jpeg",
      category: "bestseller",
      size: "12 cm & 26 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "Two complementary candles",
        "Cotton wicks",
        "Elegant fluted design",
        "12 cm and 26 cm heights",
        "Special gift packaging",
      ]),
      scent: "Unscented",
    },
    {
      name: "Lavender Fields",
      description: "Soothing lavender scented candle for relaxation and sleep",
      price: 200.0,
      image: "/lavender-dream.png",
      category: "bestseller",
      size: "15 cm",
      details: JSON.stringify([
        "Hand-poured premium wax",
        "40-hour burn time",
        "Cotton wick",
        "Lavender essential oil",
        "15 cm height",
      ]),
      scent: "Lavender",
    },
  ]

  // Insert products
  const { data, error } = await supabase.from("products").upsert(products, { onConflict: "name" })

  if (error) {
    console.error("Error seeding products:", error)
    return { success: false, error }
  }

  return { success: true, data }
}

/**
 * Verify that the database schema is set up correctly
 */
export async function verifyDatabaseSchema() {
  // Check if orders table exists
  const { data: ordersData, error: ordersError } = await supabase.from("orders").select("id").limit(1)

  if (ordersError && ordersError.code === "42P01") {
    return {
      success: false,
      message: "Orders table does not exist. Please run the migrations.",
    }
  }

  // Check if products table exists
  const { data: productsData, error: productsError } = await supabase.from("products").select("id").limit(1)

  if (productsError && productsError.code === "42P01") {
    return {
      success: false,
      message: "Products table does not exist. Please run the migrations.",
    }
  }

  // Check if customers table exists
  const { data: customersData, error: customersError } = await supabase.from("customers").select("id").limit(1)

  if (customersError && customersError.code === "42P01") {
    return {
      success: false,
      message: "Customers table does not exist. Please run the migrations.",
    }
  }

  // Check if event_bookings table exists
  const { data: bookingsData, error: bookingsError } = await supabase.from("event_bookings").select("id").limit(1)

  if (bookingsError && bookingsError.code === "42P01") {
    return {
      success: false,
      message: "Event bookings table does not exist. Please run the migrations.",
    }
  }

  return {
    success: true,
    message: "Database schema is set up correctly.",
  }
}

/**
 * Initialize the database with schema and seed data
 * Note: This should only be used in development
 */
export async function initializeDatabase() {
  // First verify the schema
  const schemaCheck = await verifyDatabaseSchema()

  if (!schemaCheck.success) {
    console.error("Database schema verification failed:", schemaCheck.message)
    return { success: false, message: schemaCheck.message }
  }

  // Seed the products
  const seedResult = await seedProducts()

  if (!seedResult.success) {
    console.error("Failed to seed products:", seedResult.error)
    return { success: false, message: "Failed to seed products" }
  }

  return {
    success: true,
    message: "Database initialized successfully with schema and seed data.",
  }
}
