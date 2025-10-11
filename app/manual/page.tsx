import { AppLayout } from "@/components/layout/app-layout"
import { SimulationControlPanel } from "@/components/simulation/simulation-control-panel"
import { ParameterEditor } from "@/components/simulation/parameter-editor"
import { mockGreenhouseZones } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"

export default function ManualOverridePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Manual Override & Simulation</h2>
          <p className="text-sm text-muted-foreground lg:text-base">
            Test scenarios and manually control greenhouse parameters for precision agriculture
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="border-warning/20 bg-warning/5 p-3 lg:p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-warning lg:text-base">Manual Override Active</h4>
              <p className="text-xs text-muted-foreground lg:text-sm">
                Changes made here will override automatic control systems. Use with caution and monitor results closely.
              </p>
            </div>
          </div>
        </Card>

        {/* Simulation Control */}
        <SimulationControlPanel />

        {/* Zone Parameter Editors */}
        <div>
          <h3 className="mb-3 text-lg font-semibold lg:mb-4 lg:text-xl">Zone Controls</h3>
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            {mockGreenhouseZones.slice(0, 4).map((zone) => (
              <div key={zone.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold lg:text-base">{zone.name}</h4>
                  <Badge
                    variant="outline"
                    className={
                      zone.status === "active"
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-warning/20 bg-warning/10 text-warning"
                    }
                  >
                    {zone.status}
                  </Badge>
                </div>
                <ParameterEditor zoneId={zone.id} />
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <Card className="p-4 lg:p-6">
          <h3 className="mb-3 text-base font-semibold lg:mb-4 lg:text-lg">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium lg:text-base">All Systems Operational</p>
                  <p className="text-xs text-muted-foreground lg:text-sm">No critical alerts</p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                Healthy
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium lg:text-base">Data Sync Active</p>
                  <p className="text-xs text-muted-foreground lg:text-sm">Last updated: Just now</p>
                </div>
              </div>
              <Badge variant="outline" className="border-accent/20 bg-accent/10 text-accent">
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-warning" />
                <div>
                  <p className="text-sm font-medium lg:text-base">Manual Mode Enabled</p>
                  <p className="text-xs text-muted-foreground lg:text-sm">Automatic adjustments paused</p>
                </div>
              </div>
              <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                Override
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
