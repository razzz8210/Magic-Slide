"use client"

import type React from "react"

import { useState } from "react"
import { createStudyBlock } from "@/lib/api"
import { Button } from "./ui/button"

interface CreateBlockModalProps {
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export function CreateBlockModal({ userId, onClose, onSuccess }: CreateBlockModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    startTime: "",
    endTime: "",
    color: "#3b82f6",
    notifyEmail: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title || !formData.startTime || !formData.endTime) {
      setError("Please fill in all required fields")
      return
    }

    // Validate dates
    const startDate = new Date(formData.startTime)
    const endDate = new Date(formData.endTime)

    if (isNaN(startDate.getTime())) {
      setError("Please enter a valid start date and time")
      return
    }

    if (isNaN(endDate.getTime())) {
      setError("Please enter a valid end date and time")
      return
    }

    if (endDate <= startDate) {
      setError("End time must be after start time")
      return
    }

    try {
      setIsSubmitting(true)
      await createStudyBlock({
        userId,
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        color: formData.color,
        notifyEmail: formData.notifyEmail,
      })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create study block")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Study Block</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Math Study Session"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about this study session"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="60"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="60"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.notifyEmail}
              onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Send email notification</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
