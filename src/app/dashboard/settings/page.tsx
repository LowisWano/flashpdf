"use client"

import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/navigation-bar"
import SimpleSettingsSection from "@/components/profile/simple-settings-section"
import AccountSection from "@/components/profile/account-section"
import AccountSecuritySection from "@/components/profile/account-security-section"
import { useProfile } from "@/hooks/useProfile"
import { Settings } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function ProfilePage() {
  const {
    // State
    isEditing,
    showSettings,
    user,
    editForm,
    passwordForm,
    settings,
    recentActivity,
    selectedImage,
    imagePreview,
    showPassword,
    showNewPassword,
    showConfirmPassword,
    showDeleteConfirmation,
    deleteConfirmation,

    // Actions
    setIsEditing,
    setShowSettings,
    handleSaveProfile,
    handleCancelEdit,
    handleEditFormChange,
    handlePasswordFormChange,
    handlePasswordChange,
    handleSettingChange,
    handleDeleteAccount,
    handleImageUpload,
    handleSaveImage,
    handleRemoveImage,
    triggerFileInput,
    handleTogglePasswordVisibility,
    handleToggleDeleteConfirmation,
    handleDeleteConfirmationChange
  } = useProfile()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="text-sm">Manage your account settings and preferences</p>
          </CardContent>
        </Card>

        {showSettings ? (
          /* Simple Settings Section */
          <SimpleSettingsSection
            user={user}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            onImageUpload={handleImageUpload}
            onSaveImage={handleSaveImage}
            triggerFileInput={triggerFileInput}
          />
        ) : (
          /* New Profile Section */
          <div className="max-w-2xl mx-auto">
            {/* Account Section with editable name */}
            <AccountSection
              user={user}
              isEditing={isEditing}
              editForm={editForm}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              onEditFormChange={handleEditFormChange}
              onImageUpload={handleImageUpload}
              onSaveImage={handleSaveImage}
              onRemoveImage={handleRemoveImage}
              triggerFileInput={triggerFileInput}
              setIsEditing={setIsEditing}
              handleSaveProfile={handleSaveProfile}
              handleCancelEdit={handleCancelEdit}
            />

            {/* Account Security Section */}
            <AccountSecuritySection
              user={user}
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        )}
      </div>
    </div>
  )
}
