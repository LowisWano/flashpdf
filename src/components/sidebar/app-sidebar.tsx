"use client"

import * as React from "react"
import {
  Folder,
  FolderOpen,
  GalleryVerticalEnd,
  Home,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { SidebarHomeMenuItem } from "./sidebar-home-menu-item"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { FolderWithDecks } from "@/lib/types"

const navItems = {
  home: [
    {
      name: "AutoDeck",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  main: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Your Library",
      url: "/dashboard/folders",
      icon: FolderOpen,
    }
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
}

export function AppSidebar({ userDetails }: {
  userDetails: {
    credentials: {
      email: string
      name: string
      avatar: string
    },
    folders: FolderWithDecks[]
  },
}) {
  const folderProjects = userDetails.folders.map(folder => ({
    name: folder.name,
    url: `/dashboard/folders/${folder.id}`,
    icon: Folder,
  }));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarHomeMenuItem teams={navItems.home} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems.main} />
        <NavProjects projects={folderProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userDetails.credentials} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}