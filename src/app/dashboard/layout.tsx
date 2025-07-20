import { CreateFlashcardsDialog } from "@/components/create-flashcards-dialog"
import { SidebarContainer } from "@/components/sidebar/sidebar-container"
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
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
      <SidebarContainer/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-sidebar justify-between pr-4">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="h-8 w-8" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <CreateFlashcardsDialog />
          </div>
        </header>
        <main className="sm:p-10 p-5">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}