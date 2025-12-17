"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, Edit3, Star } from "lucide-react"

interface StatsGridProps {
  streak: number
  totalStudyTime: string
  decksCreated: number
  averageScore: number
}

export default function StatsGrid({
  streak,
  totalStudyTime,
  decksCreated,
  averageScore
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{streak}</p>
          <p className="text-xs text-gray-600">Day Streak</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalStudyTime}</p>
          <p className="text-xs text-gray-600">Study Time</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Edit3 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{decksCreated}</p>
          <p className="text-xs text-gray-600">Decks Created</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
          <p className="text-xs text-gray-600">Avg Score</p>
        </CardContent>
      </Card>
    </div>
  )
} 