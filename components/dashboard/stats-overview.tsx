"use client"

import { Card } from "@/components/ui/card"
import type { GreenhouseZone } from "@/lib/types"
import { Activity, AlertTriangle, CheckCircle2, Power } from "lucide-react"

interface StatsOverviewProps {
  zones: GreenhouseZone[]
}

export function StatsOverview({ zones }: StatsOverviewProps) {
  const activeZones = zones.filter((z) => z.status === "active").length
  const warningZones = zones.filter((z) => z.status === "warning").length
  const offlineZones = zones.filter((z) => z.status === "offline").length
  const avgTemperature = (zones.reduce((sum, z) => sum + z.temperature.current, 0) / zones.length).toFixed(1)

  const stats = [
    {
      label: "Active Zones",
      value: activeZones,
      total: zones.length,
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Warnings",
      value: warningZones,
      total: zones.length,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Offline",
      value: offlineZones,
      total: zones.length,
      icon: Power,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Avg Temperature",
      value: `${avgTemperature}°C`,
      total: "",
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.total && <span className="text-sm text-muted-foreground">/ {stat.total}</span>}
              </div>
            </div>
            <div className={`rounded-lg p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
