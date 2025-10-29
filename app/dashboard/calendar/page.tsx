"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getStudyBlocks, type StudyBlock } from "@/lib/api"
import { CalendarView } from "@/components/CalendarView"
import { Button } from "@/components/ui/button"

export default function CalendarPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [blocks, setBlocks] = useState<StudyBlock[]>([])
  const [blocksLoading, setBlocksLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      const fetchBlocks = async () => {
        try {
          const data = await getStudyBlocks(user.id)
          setBlocks(data)
        } catch (error) {
          console.error("Failed to fetch blocks:", error)
        } finally {
          setBlocksLoading(false)
        }
      }
      fetchBlocks()
    }
  }, [user])

  if (loading || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Study Calendar</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blocksLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CalendarView blocks={blocks} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        )}
      </main>
    </div>
  )
}
