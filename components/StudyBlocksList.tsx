"use client"

import { useEffect, useState } from "react"
import { getStudyBlocks, type StudyBlock } from "@/lib/api"
import { StudyBlockCard } from "./StudyBlockCard"

interface StudyBlocksListProps {
  userId: string
  refreshTrigger: number
}

export function StudyBlocksList({ userId, refreshTrigger }: StudyBlocksListProps) {
  const [blocks, setBlocks] = useState<StudyBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true)
        const data = await getStudyBlocks(userId)
        setBlocks(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blocks")
      } finally {
        setLoading(false)
      }
    }

    fetchBlocks()
  }, [userId, refreshTrigger])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-gray-600 text-lg">No study blocks yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blocks.map((block) => (
        <StudyBlockCard key={block._id} block={block} onRefresh={() => {}} />
      ))}
    </div>
  )
}
