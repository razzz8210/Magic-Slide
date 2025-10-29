"use client"

import { useState } from "react"
import { type StudyBlock, deleteStudyBlock } from "@/lib/api"
import { Button } from "./ui/button"
import { EditBlockModal } from "./EditBlockModal"
import { CountdownTimer } from "./CountdownTimer"

interface StudyBlockCardProps {
  block: StudyBlock
  onRefresh: () => void
}

export function StudyBlockCard({ block, onRefresh }: StudyBlockCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this study block?")) {
      try {
        setIsDeleting(true)
        await deleteStudyBlock(block._id)
        onRefresh()
      } catch (error) {
        alert("Failed to delete study block")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const startTime = new Date(block.startTime)
  const endTime = new Date(block.endTime)
  const now = new Date()
  const isUpcoming = startTime > now
  const isOngoing = startTime <= now && endTime > now

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
        style={{ borderLeftColor: block.color, borderLeftWidth: "4px" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
            {block.subject && <p className="text-sm text-gray-600">{block.subject}</p>}
          </div>
          {isOngoing && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">Ongoing</span>
          )}
          {isUpcoming && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Upcoming</span>
          )}
        </div>

        {block.description && <p className="text-gray-600 text-sm mb-4">{block.description}</p>}

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <p>
            <strong>Start:</strong> {startTime.toLocaleString()}
          </p>
          <p>
            <strong>End:</strong> {endTime.toLocaleString()}
          </p>
        </div>

        {isOngoing && <CountdownTimer endTime={endTime} />}

        <div className="flex gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            Delete
          </Button>
        </div>
      </div>

      {showEditModal && (
        <EditBlockModal
          block={block}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            onRefresh()
          }}
        />
      )}
    </>
  )
}
