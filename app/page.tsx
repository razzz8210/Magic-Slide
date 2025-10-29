"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { GoogleLoginButton } from "@/components/GoogleLoginButton"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-red-600">MagicSlides Study App</h1>
        <p className="text-lg text-gray-300 mb-8">
          Smart study management with automated scheduling and email reminders
        </p>
        <div className="bg-gray-900 rounded-2xl shadow-xl p-2 transition-all duration-300 hover:shadow-2xl hover:shadow-red-700/50 hover:bg-gray-800">
          <GoogleLoginButton />
        </div>
      </div>
    </main>
  )

}
