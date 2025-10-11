import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ZoneCard } from "@/components/dashboard/zone-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { mockGreenhouseZones } from "@/lib/mock-data"

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="mt-16 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Monitor and control all greenhouse zones from a single interface</p>
            </div>

            {/* Stats Overview */}
            <StatsOverview zones={mockGreenhouseZones} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Zones Grid */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">All Zones</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockGreenhouseZones.map((zone) => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <RecentAlerts />
          </div>
        </main>
      </div>
    </div>
  )
}
