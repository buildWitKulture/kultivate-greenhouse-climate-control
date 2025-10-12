import { AppLayout } from "@/components/layout/app-layout"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ZoneCard } from "@/components/dashboard/zone-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { mockGreenhouseZones, zonesCropTypes } from "@/lib/mock-data"

export default function HomePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Dashboard</h2>
          <p className="text-sm text-muted-foreground lg:text-base">
            Monitor and control all greenhouse zones from a single interface
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview zones={mockGreenhouseZones} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Zones Grid */}
        <div>
          <h3 className="mb-3 text-lg font-semibold lg:mb-4 lg:text-xl">All Zones</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {mockGreenhouseZones.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} cropType={zonesCropTypes[zone.id]} />
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <RecentAlerts />
      </div>
    </AppLayout>
  )
}
