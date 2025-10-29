"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  picture: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => void
  openaiKey: string | null
  setOpenaiKey: (key: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [openaiKey, setOpenaiKeyState] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    const storedOpenaiKey = localStorage.getItem("openaiKey")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedOpenaiKey) {
      setOpenaiKeyState(storedOpenaiKey)
    }

    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("openaiKey")
    setOpenaiKeyState(null)
  }

  const setOpenaiKey = (key: string) => {
    setOpenaiKeyState(key)
    localStorage.setItem("openaiKey", key)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, openaiKey, setOpenaiKey }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
