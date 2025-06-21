"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Edit3 } from "lucide-react"

interface Activity {
  id: number
  type: "study" | "create"
  title: string
  time: string
  score?: number
  cards?: number
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  activity.type === 'study' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'study' ? (
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Edit3 className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                {activity.type === 'study' ? (
                  <Badge variant="secondary">{activity.score}%</Badge>
                ) : (
                  <Badge variant="outline">{activity.cards} cards</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 