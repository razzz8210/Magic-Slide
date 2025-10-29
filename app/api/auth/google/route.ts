import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { googleId, email, name, picture } = await request.json()

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    
    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL is not set")
      return NextResponse.json(
        { error: "Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL in .env.local" },
        { status: 500 }
      )
    }

    console.log(`Calling backend at: ${backendUrl}/api/auth/google`)

    const response = await fetch(`${backendUrl}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleId,
        email,
        name,
        picture,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Backend error:", data)
      return NextResponse.json({ error: data.error || "Backend authentication failed" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json(
      { 
        error: "Authentication failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        hint: "Make sure the backend server is running on the configured port"
      },
      { status: 500 }
    )
  }
}
