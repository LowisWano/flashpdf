import NavigationBar from "@/components/navigation-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavigationBar/>
      <main className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}