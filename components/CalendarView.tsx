"use client"

import { useState } from "react"
import type { StudyBlock } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarViewProps {
  blocks: StudyBlock[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarView({ blocks, selectedDate, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getBlocksForDate = (date: Date) => {
    return blocks.filter((block) => {
      const blockDate = new Date(block.startTime)
      return (
        blockDate.getDate() === date.getDate() &&
        blockDate.getMonth() === date.getMonth() &&
        blockDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const dayBlocks = day ? getBlocksForDate(day) : []
          const isToday = day && day.toDateString() === new Date().toDateString()
          const isSelected = day && day.toDateString() === selectedDate.toDateString()

          return (
            <div
              key={index}
              onClick={() => day && onDateSelect(day)}
              className={`
                min-h-24 p-2 rounded-lg border-2 cursor-pointer transition-all
                ${!day ? "bg-gray-50 border-transparent" : ""}
                ${isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                ${isSelected ? "bg-blue-100 border-blue-600" : ""}
                ${day && !isToday && !isSelected ? "hover:border-gray-300 hover:bg-gray-50" : ""}
              `}
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayBlocks.slice(0, 2).map((block) => (
                      <div
                        key={block._id}
                        className="text-xs px-2 py-1 rounded text-white truncate"
                        style={{ backgroundColor: block.color }}
                        title={block.title}
                      >
                        {block.title}
                      </div>
                    ))}
                    {dayBlocks.length > 2 && (
                      <div className="text-xs text-gray-600 px-2">+{dayBlocks.length - 2} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
          </h3>
          <div className="space-y-3">
            {getBlocksForDate(selectedDate).length === 0 ? (
              <p className="text-gray-600">No study blocks scheduled for this day</p>
            ) : (
              getBlocksForDate(selectedDate).map((block) => (
                <div
                  key={block._id}
                  className="bg-gray-50 rounded-lg p-4 border-l-4"
                  style={{ borderLeftColor: block.color }}
                >
                  <h4 className="font-semibold text-gray-900">{block.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(block.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(block.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {block.subject && <p className="text-sm text-gray-600">Subject: {block.subject}</p>}
                  {block.description && <p className="text-sm text-gray-600 mt-2">{block.description}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
