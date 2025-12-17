"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Save, X } from "lucide-react"
import { useRef } from "react"

interface ProfileCardProps {
  user: {
    name: string
    email: string
    avatar: string
    joinDate: string
    bio: string
    level: string
  }
  isEditing: boolean
  editForm: {
    name: string
    email: string
    bio: string
  }
  selectedImage: File | null
  imagePreview: string | null
  onEditFormChange: (field: string, value: string) => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSaveImage: () => void
  onRemoveImage: () => void
  triggerEditFileInput: () => void
}

export default function ProfileCard({
  user,
  isEditing,
  editForm,
  selectedImage,
  imagePreview,
  onEditFormChange,
  onImageUpload,
  onSaveImage,
  onRemoveImage,
  triggerEditFileInput
}: ProfileCardProps) {
  const editFileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={imagePreview || user.avatar || "https://github.com/shadcn.png"} 
                alt={user.name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button
                onClick={triggerEditFileInput}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <Input 
                value={editForm.name}
                onChange={(e) => onEditFormChange('name', e.target.value)}
                className="text-center text-xl font-semibold"
              />
              <Input 
                value={editForm.email}
                disabled
                className="text-center text-sm bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{user.email}</p>
            </>
          )}
          <Badge variant="secondary" className="mb-3">
            {user.level}
          </Badge>
          <p className="text-sm text-gray-600 mb-4">
            Member since {user.joinDate}
          </p>
          {isEditing ? (
            <textarea 
              value={editForm.bio}
              onChange={(e) => onEditFormChange('bio', e.target.value)}
              className="w-full p-2 text-sm text-gray-700 leading-relaxed border border-gray-300 rounded resize-none"
              rows={3}
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.bio}
            </p>
          )}
          {isEditing && selectedImage && (
            <div className="mt-4 space-y-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
              <div className="flex space-x-2 justify-center">
                <Button onClick={onSaveImage} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Image
                </Button>
                <Button onClick={onRemoveImage} size="sm" variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <input
          ref={editFileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
} 