import { type NextRequest, NextResponse } from "next/server"

// Auto-detect backend URL: use env variable for local dev, or self for Vercel
function getBackendUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 
         `https://${request.headers.get('host')}`
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const backendUrl = getBackendUrl(request)
    const response = await fetch(`${backendUrl}/api/study-blocks/user/${userId}`)
    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch study blocks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = getBackendUrl(request)
    const response = await fetch(`${backendUrl}/api/study-blocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create study block" }, { status: 500 })
  }
}
