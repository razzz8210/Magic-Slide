"use client"

import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export function GoogleLoginButton() {
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Initialize Google Sign-In programmatically.
    // The <script> for GSI is loaded async/defer in layout.tsx, so the
    // library may not be present immediately. Poll a few times and then
    // initialize once available. Also ensure the client ID is provided.
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      console.error("Google Sign-In: Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable")
      return
    }

    let attempts = 0
    const maxAttempts = 50 // ~5s (50 * 100ms)

    const tryInit = () => {
      attempts += 1
      // use a safe any cast to avoid TS errors for the global google object
      const g = (window as any).google
      if (g && g.accounts && g.accounts.id) {
        try {
          g.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
          })

          // Render the button into the element with id 'g_id_signin'
          g.accounts.id.renderButton(document.getElementById("g_id_signin"), {
            theme: "outline",
            size: "large",
            type: "standard",
          })

          // Optionally show the One Tap prompt
          // g.accounts.id.prompt()
        } catch (e) {
          console.error("Google Sign-In initialization failed:", e)
        }
      } else if (attempts < maxAttempts) {
        setTimeout(tryInit, 100)
      } else {
        console.error("Google Sign-In: google.accounts.id not available after waiting")
      }
    }

    tryInit()
  }, [])

  const handleCredentialResponse = async (response: any) => {
    try {
      // Decode JWT token
      const base64Url = response.credential.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      const decoded = JSON.parse(jsonPayload)

      // Send to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        login(data.user)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <div>
      <div
        id="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="signin_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </div>
  )
}
