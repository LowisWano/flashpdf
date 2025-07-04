"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Trash2, AlertTriangle, LogOut } from "lucide-react"
import { useState } from "react"
import { logout } from "@/app/login/actions"

interface AccountSecurityProps {
  user: {
    name: string
    email: string
  }
  onDeleteAccount: () => void
}

export default function AccountSecuritySection({
  user,
  onDeleteAccount
}: AccountSecurityProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Account Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Username</p>
              <p className="text-sm text-gray-600">{user.name.toLowerCase().replace(/\s/g, '')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
          
          {/* Delete Account Button */}
          {!showDeleteConfirm ? (
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Are you sure?</p>
                  <p className="text-xs text-red-700">This action cannot be undone. Your account and all data will be permanently deleted.</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  className="bg-red-600 hover:bg-red-700 flex-1" 
                  onClick={onDeleteAccount}
                >
                  Yes, Delete My Account
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
