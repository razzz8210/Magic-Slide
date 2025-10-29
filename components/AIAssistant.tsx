"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "./ui/button"
import { X } from "lucide-react"

interface AIAssistantProps {
  onClose: () => void
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const { openaiKey } = useAuth()
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!openaiKey) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">AI Study Assistant</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">Please set your OpenAI API key first to use the AI Assistant.</p>
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </div>
      </div>
    )
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful study assistant. Help users with study tips, time management, and motivation for their study sessions.",
            },
            ...messages,
            { role: "user", content: userMessage },
          ],
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from OpenAI")
      }

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full h-96 flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">AI Study Assistant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-8">
              Ask me anything about studying, time management, or motivation!
            </p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg text-sm rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-red-700 text-sm">{error}</div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-4"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
