import { type NextRequest, NextResponse } from "next/server"

// Auto-detect backend URL: use env variable for local dev, or self for Vercel
function getBackendUrl(request: NextRequest): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 
         `https://${request.headers.get('host')}`
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = getBackendUrl(request)
    const response = await fetch(`${backendUrl}/api/study-blocks/${params.id}`)
    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch study block" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const backendUrl = getBackendUrl(request)
    const response = await fetch(`${backendUrl}/api/study-blocks/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update study block" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = getBackendUrl(request)
    const response = await fetch(`${backendUrl}/api/study-blocks/${params.id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete study block" }, { status: 500 })
  }
}
