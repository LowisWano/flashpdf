"use client"

import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/navigation-bar"
import SimpleSettingsSection from "@/components/profile/simple-settings-section"
import AccountSection from "@/components/profile/account-section"
import AccountSecuritySection from "@/components/profile/account-security-section"
import { useProfile } from "@/hooks/useProfile"
import { Car, Settings } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-6 w-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="text-gray-500">Manage all your preferences</p>
          </div>

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
    </div>
  )
}
