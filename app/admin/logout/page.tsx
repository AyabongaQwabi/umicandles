"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear admin authentication
    localStorage.removeItem("umi_admin_auth")

    // Redirect to admin login after a short delay
    const redirectTimer = setTimeout(() => {
      router.push("/admin")
      // Force a page reload to ensure all state is cleared
      window.location.href = "/admin"
    }, 1000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto text-fuchsia-600 mb-4" />
        <h1 className="text-xl font-medium mb-2">Logging out...</h1>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  )
}
