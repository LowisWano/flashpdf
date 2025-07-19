import NavigationBar from "@/components/navigation-bar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <SidebarTrigger className="p-2 h-12 w-12" />
        <main className="sm:p-10 p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}