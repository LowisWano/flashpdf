import NavigationBar from "@/components/navigation-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavigationBar/>
      <main className="sm:p-15 p-5 md:max-w-[1900px] md:mx-auto">{children}</main>
    </div>
  )
}