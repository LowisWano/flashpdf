"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Camera, Edit3, Save, X } from "lucide-react"
import { useRef } from "react"

interface AccountSectionProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  isEditing: boolean
  editForm: {
    name: string
  }
  selectedImage: File | null
  imagePreview: string | null
  onEditFormChange: (field: string, value: string) => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSaveImage: () => void
  onRemoveImage: () => void
  triggerFileInput: () => void
  setIsEditing: (isEditing: boolean) => void
  handleSaveProfile: () => void
  handleCancelEdit: () => void
}

export default function AccountSection({
  user,
  isEditing,
  editForm,
  selectedImage,
  imagePreview,
  onEditFormChange,
  onImageUpload,
  onSaveImage,
  onRemoveImage,
  triggerFileInput,
  setIsEditing,
  handleSaveProfile,
  handleCancelEdit
}: AccountSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Account</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSaveProfile} size="sm" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage 
                src={imagePreview || user.avatar || "https://github.com/shadcn.png"} 
                alt={user.name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="text-lg">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button
                onClick={triggerFileInput}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors shadow-md"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageUpload}
              ref={fileInputRef}
            />
          </div>
          
          <div className="flex-grow">
            {isEditing ? (
              <Input 
                value={editForm.name}
                onChange={(e) => onEditFormChange('name', e.target.value)}
                className="font-medium"
                placeholder="Your name"
              />
            ) : (
              <h3 className="font-medium text-lg">{user.name}</h3>
            )}
          </div>
        </div>
        
        {isEditing && selectedImage && (
          <div className="mt-4 space-y-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
            <div className="flex space-x-2">
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
      </CardContent>
    </Card>
  )
}
