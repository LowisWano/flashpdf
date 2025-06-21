import { useState, useRef } from "react"

export function useProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock user data - in a real app this would come from your auth system
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/api/placeholder/150/150",
    joinDate: "March 2023",
    bio: "Passionate about learning and creating study materials. Love exploring new topics and helping others learn.",
    level: "Advanced",
    streak: 45,
    totalStudyTime: "127 hours",
    decksCreated: 23,
    decksStudied: 156,
    averageScore: 87
  })

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    studyReminders: true,
    publicProfile: true
  })

  const recentActivity = [
    {
      id: 1,
      type: "study" as const,
      title: "Studied History Deck",
      time: "2 hours ago",
      cards: 15
    },
    {
      id: 2,
      type: "create" as const,
      title: "Created Science Deck",
      time: "1 day ago",
      cards: 25
    },
    {
      id: 3,
      type: "study" as const,
      title: "Studied Math Deck",
      time: "2 days ago",
      cards: 20
    },
    {
      id: 4,
      type: "create" as const,
      title: "History Timeline",
      time: "3 days ago",
      cards: 32
    }
  ]

  const handleSaveProfile = () => {
    setUser(prev => ({ ...prev, ...editForm }))
    setIsEditing(false)
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio
    })
    setIsEditing(false)
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    alert("Password changed successfully!")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }))
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      alert("Please type 'DELETE' to confirm account deletion")
      return
    }
    alert("Account deleted successfully!")
    window.location.href = "/"
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }

      setSelectedImage(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveImage = () => {
    if (selectedImage && imagePreview) {
      setUser(prev => ({ ...prev, avatar: imagePreview }))
      setSelectedImage(null)
      setImagePreview(null)
      alert('Profile image updated successfully!')
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerEditFileInput = () => {
    // This will be handled by the ProfileCard component
  }

  const handleTogglePasswordVisibility = (field: string) => {
    switch (field) {
      case 'current':
        setShowPassword(!showPassword)
        break
      case 'new':
        setShowNewPassword(!showNewPassword)
        break
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  const handleToggleDeleteConfirmation = () => {
    setShowDeleteConfirmation(!showDeleteConfirmation)
    if (!showDeleteConfirmation) {
      setDeleteConfirmation("")
    }
  }

  const handleDeleteConfirmationChange = (value: string) => {
    setDeleteConfirmation(value)
  }

  return {
    // State
    isEditing,
    showSettings,
    showPassword,
    showNewPassword,
    showConfirmPassword,
    showDeleteConfirmation,
    deleteConfirmation,
    selectedImage,
    imagePreview,
    user,
    editForm,
    passwordForm,
    settings,
    recentActivity,
    fileInputRef,

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
    triggerEditFileInput,
    handleTogglePasswordVisibility,
    handleToggleDeleteConfirmation,
    handleDeleteConfirmationChange
  }
} 