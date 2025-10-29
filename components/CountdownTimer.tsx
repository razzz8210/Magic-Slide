"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  endTime: Date
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const diff = endTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Time's up!")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <p className="text-sm font-semibold text-blue-900">Time Remaining: {timeLeft}</p>
    </div>
  )
}
