import NavigationBar from "@/components/navigation-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavigationBar/>
      <main className="p-15">{children}</main>
    </div>
  )
}