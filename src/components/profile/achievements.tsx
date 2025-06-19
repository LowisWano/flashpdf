"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, BookOpen, Clock, Star, Edit3, Target } from "lucide-react"

interface Achievement {
  id: string
  title: string
  icon: React.ReactNode
  unlocked: boolean
}

interface AchievementsProps {
  achievements: Achievement[]
}

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`text-center p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <div className={achievement.unlocked ? 'text-green-600' : 'text-gray-400'}>
                  {achievement.icon}
                </div>
              </div>
              <p className={`text-sm font-medium ${
                achievement.unlocked ? 'text-green-800' : 'text-gray-500'
              }`}>
                {achievement.title}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 