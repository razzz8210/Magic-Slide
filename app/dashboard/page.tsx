"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { StudyBlocksList } from "@/components/StudyBlocksList"
import { CreateBlockModal } from "@/components/CreateBlockModal"
import { OpenAIKeyModal } from "@/components/OpenAIKeyModal"
import { Button } from "@/components/ui/button"
import { AIAssistant } from "@/components/AIAssistant"

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showOpenAIModal, setShowOpenAIModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MagicSlides Study App</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowAIAssistant(true)}>
              AI Assistant
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/calendar")}>
              Calendar
            </Button>
            <Button variant="outline" onClick={() => setShowOpenAIModal(true)}>
              OpenAI Key
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Study Blocks</h2>
          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
            Create Study Block
          </Button>
        </div>

        <StudyBlocksList userId={user.id} refreshTrigger={refreshTrigger} />
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateBlockModal
          userId={user.id}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            setRefreshTrigger((prev) => prev + 1)
          }}
        />
      )}

      {showOpenAIModal && <OpenAIKeyModal onClose={() => setShowOpenAIModal(false)} />}

      {showAIAssistant && <AIAssistant onClose={() => setShowAIAssistant(false)} />}
    </div>
  )
}
