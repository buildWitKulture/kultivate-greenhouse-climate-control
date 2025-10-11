import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { SimulationControlPanel } from "@/components/simulation/simulation-control-panel"
import { ParameterEditor } from "@/components/simulation/parameter-editor"
import { mockGreenhouseZones } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"

export default function ManualOverridePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="mt-16 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Manual Override & Simulation</h2>
              <p className="text-muted-foreground">
                Test scenarios and manually control greenhouse parameters for precision agriculture
              </p>
            </div>

            {/* Warning Banner */}
            <Card className="border-warning/20 bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
                <div className="flex-1">
                  <h4 className="font-semibold text-warning">Manual Override Active</h4>
                  <p className="text-sm text-muted-foreground">
                    Changes made here will override automatic control systems. Use with caution and monitor results
                    closely.
                  </p>
                </div>
              </div>
            </Card>

            {/* Simulation Control */}
            <SimulationControlPanel />

            {/* Zone Parameter Editors */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Zone Controls</h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {mockGreenhouseZones.slice(0, 4).map((zone) => (
                  <div key={zone.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{zone.name}</h4>
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
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">All Systems Operational</p>
                      <p className="text-sm text-muted-foreground">No critical alerts</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
                    Healthy
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium">Data Sync Active</p>
                      <p className="text-sm text-muted-foreground">Last updated: Just now</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-accent/20 bg-accent/10 text-accent">
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium">Manual Mode Enabled</p>
                      <p className="text-sm text-muted-foreground">Automatic adjustments paused</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                    Override
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
