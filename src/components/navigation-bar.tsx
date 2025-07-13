"use client"

import { Sparkles, LogOut, Library, Folder, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/app/login/actions"

export default function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={"/dashboard"}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              FlashPDF
            </span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/dashboard" 
            className={`flex items-center space-x-1.5 pb-3 border-b-2 ${isActive('/dashboard') && !isActive('/dashboard/folders') ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-orange-500'} transition-colors`}
          >
            <Library className="w-4 h-4" />
            <span className="font-medium">My Flashcards</span>
          </Link>
          
          <Link 
            href="/dashboard/folders" 
            className={`flex items-center space-x-1.5 pb-3 border-b-2 ${isActive('/dashboard/folders') ? 'border-orange-500 text-orange-600' : 'border-transparent hover:text-orange-500'} transition-colors`}
          >
            <Folder className="w-4 h-4" />
            <span className="font-medium">Folders</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}