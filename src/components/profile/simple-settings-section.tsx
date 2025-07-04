"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Camera } from "lucide-react"
import { useRef } from "react"
import { logout } from "@/app/login/actions"
import { useRouter } from "next/navigation"

interface SimpleSettingsSectionProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  selectedImage: File | null
  imagePreview: string | null
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSaveImage: () => void
  triggerFileInput: () => void
}

export default function SimpleSettingsSection({
  user,
  selectedImage,
  imagePreview,
  onImageUpload,
  onSaveImage,
  triggerFileInput
}: SimpleSettingsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture Section */}
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={imagePreview || user.avatar || "https://github.com/shadcn.png"} 
                alt={user.name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 rounded-full p-2 shadow-sm"
              onClick={triggerFileInput}
            >
              <Camera className="w-4 h-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onImageUpload}
            />
          </div>

          {/* Name Display */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          {/* Save Image Button - Only show when an image is selected */}
          {selectedImage && (
            <Button onClick={onSaveImage} className="w-full">
              Save Profile Picture
            </Button>
          )}

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
