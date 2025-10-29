"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "./ui/button"

interface OpenAIKeyModalProps {
  onClose: () => void
}

export function OpenAIKeyModal({ onClose }: OpenAIKeyModalProps) {
  const { openaiKey, setOpenaiKey } = useAuth()
  const [key, setKey] = useState(openaiKey || "")
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    if (key.trim()) {
      setOpenaiKey(key)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">OpenAI API Key</h2>

        <p className="text-gray-600 text-sm mb-4">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="sk-..."
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
