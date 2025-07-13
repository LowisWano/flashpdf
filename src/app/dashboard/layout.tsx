import { Fragment } from "react"
import { Folder, Library } from "lucide-react"
import NavigationBar from "@/components/navigation-bar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      <NavigationBar />
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </Fragment>
  )
}