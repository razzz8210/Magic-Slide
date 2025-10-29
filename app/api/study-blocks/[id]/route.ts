import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/study-blocks/${params.id}`)
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

    const response = await fetch(`${BACKEND_URL}/api/study-blocks/${params.id}`, {
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
    const response = await fetch(`${BACKEND_URL}/api/study-blocks/${params.id}`, {
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
