"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Camera, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Trash2, 
  AlertTriangle, 
  Upload, 
  Save, 
  X,
  Eye,
  EyeOff
} from "lucide-react"
import { useRef } from "react"

interface SettingsSectionProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  editForm: {
    name: string
    email: string
    bio: string
  }
  passwordForm: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  settings: {
    emailNotifications: boolean
    studyReminders: boolean
    publicProfile: boolean
  }
  selectedImage: File | null
  imagePreview: string | null
  showPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  showDeleteConfirmation: boolean
  deleteConfirmation: string
  onEditFormChange: (field: string, value: string) => void
  onPasswordFormChange: (field: string, value: string) => void
  onSettingChange: (setting: string, value: boolean) => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSaveImage: () => void
  onRemoveImage: () => void
  onPasswordChange: () => void
  onDeleteAccount: () => void
  onTogglePasswordVisibility: (field: string) => void
  onToggleDeleteConfirmation: () => void
  onDeleteConfirmationChange: (value: string) => void
  triggerFileInput: () => void
}

export default function SettingsSection({
  user,
  editForm,
  passwordForm,
  settings,
  selectedImage,
  imagePreview,
  showPassword,
  showNewPassword,
  showConfirmPassword,
  showDeleteConfirmation,
  deleteConfirmation,
  onEditFormChange,
  onPasswordFormChange,
  onSettingChange,
  onImageUpload,
  onSaveImage,
  onRemoveImage,
  onPasswordChange,
  onDeleteAccount,
  onTogglePasswordVisibility,
  onToggleDeleteConfirmation,
  onDeleteConfirmationChange,
  triggerFileInput
}: SettingsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Image Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage 
                  src={imagePreview || user.avatar} 
                  alt={user.name} 
                />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={triggerFileInput}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors"
              >
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Upload a new profile image. Supported formats: JPG, PNG, GIF. Max size: 5MB.
              </p>
              <div className="flex space-x-2">
                <Button onClick={triggerFileInput} size="sm" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                {selectedImage && (
                  <>
                    <Button onClick={onSaveImage} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={onRemoveImage} size="sm" variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          {selectedImage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={editForm.name} 
              onChange={(e) => onEditFormChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={editForm.email} 
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed at this time</p>
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio" 
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={3}
              value={editForm.bio} 
              onChange={(e) => onEditFormChange('bio', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input 
                id="currentPassword" 
                type={showPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => onPasswordFormChange('currentPassword', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => onTogglePasswordVisibility('current')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input 
                id="newPassword" 
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => onPasswordFormChange('newPassword', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => onTogglePasswordVisibility('new')}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => onPasswordFormChange('confirmPassword', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => onTogglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={onPasswordChange} className="w-full">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email updates about your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => onSettingChange('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Study Reminders</p>
              <p className="text-sm text-gray-600">Get reminded to study your decks</p>
            </div>
            <input
              type="checkbox"
              checked={settings.studyReminders}
              onChange={(e) => onSettingChange('studyReminders', e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-gray-600">Allow others to view your profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.publicProfile}
              onChange={(e) => onSettingChange('publicProfile', e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="lg:col-span-2 border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Warning: This action cannot be undone</h4>
                <p className="text-sm text-red-700">
                  Deleting your account will permanently remove all your data, including:
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• All your flashcard decks</li>
                  <li>• Study progress and statistics</li>
                  <li>• Account settings and preferences</li>
                </ul>
              </div>
            </div>
          </div>
          
          {showDeleteConfirmation ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="deleteConfirmation" className="text-red-700">
                  Type "DELETE" to confirm
                </Label>
                <Input 
                  id="deleteConfirmation"
                  value={deleteConfirmation}
                  onChange={(e) => onDeleteConfirmationChange(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={onDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE"}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Permanently Delete Account
                </Button>
                <Button 
                  onClick={onToggleDeleteConfirmation}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={onToggleDeleteConfirmation}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 