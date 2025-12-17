"use client"

import { Sparkles, LogOut, User, Settings, FolderOpen } from "lucide-react"
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
    return pathname?.startsWith(path) ? "bg-gray-100" : ""
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={"/dashboard"}>
              <div className="flex items-center space-x-2 mr-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] bg-clip-text text-transparent">
                  AutoDeck
                </span>
              </div>
            </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/dashboard" 
              className={`px-4 py-2 rounded-md flex items-center hover:bg-gray-100 transition-colors ${isActive("/dashboard") && !isActive("/dashboard/folders") ? "bg-gray-100" : ""}`}
            >
              <span>Decks</span>
            </Link>
            <Link 
              href="/dashboard/folders" 
              className={`px-4 py-2 rounded-md flex items-center hover:bg-gray-100 transition-colors ${isActive("/dashboard/folders")}`}
            >
              <span>Folders</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">

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
              
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/dashboard" className="flex items-center">
                  <span>Decks</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="/dashboard/folders" className="flex items-center">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Folders
                </Link>
              </DropdownMenuItem>

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