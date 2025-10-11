"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle } from "lucide-react"

const mockAlerts = [
  {
    id: "1",
    type: "warning",
    zone: "Greenhouse 4",
    message: "Temperature exceeds target by 2°C",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    type: "info",
    zone: "Greenhouse 2",
    message: "Irrigation cycle completed",
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "3",
    type: "success",
    zone: "Greenhouse 1",
    message: "All parameters within optimal range",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "4",
    type: "warning",
    zone: "Greenhouse 3",
    message: "Humidity above target threshold",
    timestamp: new Date(Date.now() - 5400000),
  },
]

export function RecentAlerts() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-primary" />
      default:
        return <Info className="h-4 w-4 text-accent" />
    }
  }

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
            Warning
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
            Success
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-accent/20 bg-accent/10 text-accent">
            Info
          </Badge>
        )
    }
  }

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Alerts</h3>
        <Badge variant="secondary">{mockAlerts.length} new</Badge>
      </div>
      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{alert.zone}</p>
                {getAlertBadge(alert.type)}
              </div>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
