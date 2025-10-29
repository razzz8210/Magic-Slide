const API_BASE = "/api"

export interface StudyBlock {
  _id: string
  userId: string
  title: string
  description?: string
  startTime: string
  endTime: string
  subject?: string
  color: string
  notifyEmail: boolean
  createdAt: string
  updatedAt: string
}

export async function getStudyBlocks(userId: string): Promise<StudyBlock[]> {
  const response = await fetch(`${API_BASE}/study-blocks?userId=${userId}`)
  if (!response.ok) throw new Error("Failed to fetch study blocks")
  return response.json()
}

export async function createStudyBlock(block: Omit<StudyBlock, "_id" | "createdAt" | "updatedAt">) {
  const response = await fetch(`${API_BASE}/study-blocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(block),
  })
  if (!response.ok) throw new Error("Failed to create study block")
  return response.json()
}

export async function updateStudyBlock(id: string, block: Partial<StudyBlock>) {
  const response = await fetch(`${API_BASE}/study-blocks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(block),
  })
  if (!response.ok) throw new Error("Failed to update study block")
  return response.json()
}

export async function deleteStudyBlock(id: string) {
  const response = await fetch(`${API_BASE}/study-blocks/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete study block")
  return response.json()
}
