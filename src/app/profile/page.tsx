"use client"

import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/navigation-bar"
import ProfileCard from "@/components/profile/profile-card"
import StatsGrid from "@/components/profile/stats-grid"
import RecentActivity from "@/components/profile/recent-activity"
import SettingsSection from "@/components/profile/settings-section"
import { useProfile } from "@/hooks/useProfile"
import { Edit3, Settings, Save, X } from "lucide-react"

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {showSettings ? "Settings" : "Profile"}
              </h1>
              <p className="text-gray-600">
                {showSettings ? "Manage your account settings" : "Manage your account and view your progress"}
              </p>
            </div>
            <div className="flex space-x-2">
              {!showSettings && (
                <>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
              <Button 
                onClick={() => setShowSettings(!showSettings)} 
                variant={showSettings ? "default" : "outline"}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showSettings ? "Back to Profile" : "Settings"}
              </Button>
            </div>
          </div>

          {showSettings ? (
            /* Settings Section */
            <SettingsSection
              user={user}
              editForm={editForm}
              passwordForm={passwordForm}
              settings={settings}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              showPassword={showPassword}
              showNewPassword={showNewPassword}
              showConfirmPassword={showConfirmPassword}
              showDeleteConfirmation={showDeleteConfirmation}
              deleteConfirmation={deleteConfirmation}
              onEditFormChange={handleEditFormChange}
              onPasswordFormChange={handlePasswordFormChange}
              onSettingChange={handleSettingChange}
              onImageUpload={handleImageUpload}
              onSaveImage={handleSaveImage}
              onRemoveImage={handleRemoveImage}
              onPasswordChange={handlePasswordChange}
              onDeleteAccount={handleDeleteAccount}
              onTogglePasswordVisibility={handleTogglePasswordVisibility}
              onToggleDeleteConfirmation={handleToggleDeleteConfirmation}
              onDeleteConfirmationChange={handleDeleteConfirmationChange}
              triggerFileInput={triggerFileInput}
            />
          ) : (
            /* Profile Section */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <ProfileCard
                  user={user}
                  isEditing={isEditing}
                  editForm={editForm}
                  selectedImage={selectedImage}
                  imagePreview={imagePreview}
                  onEditFormChange={handleEditFormChange}
                  onImageUpload={handleImageUpload}
                  onSaveImage={handleSaveImage}
                  onRemoveImage={handleRemoveImage}
                  triggerEditFileInput={() => {
                    // This will be handled by the ProfileCard component internally
                  }}
                />
              </div>

              {/* Stats and Activity */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Grid */}
                <StatsGrid
                  streak={user.streak}
                  totalStudyTime={user.totalStudyTime}
                  decksCreated={user.decksCreated}
                  averageScore={user.averageScore}
                />

                {/* Recent Activity */}
                <RecentActivity activities={recentActivity} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
