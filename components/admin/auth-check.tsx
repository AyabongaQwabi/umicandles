"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

// In a real application, this would be handled by Supabase Auth or similar
// This is a simplified version for demonstration purposes
const ADMIN_EMAIL = "admin@umicandles.com"
const ADMIN_PASSWORD = "123456" // This should be stored securely in a real app

export default function AdminAuthCheck({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("umi_admin_auth")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("umi_admin_auth", "true")
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid email or password")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-fuchsia-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-fuchsia-600" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-medium text-center mb-6">Admin Login</h1>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-fuchsia-600 text-white py-2 rounded-md font-medium hover:bg-fuchsia-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
