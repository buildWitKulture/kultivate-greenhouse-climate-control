"use client"

import Link from "next/link"
import type { GreenhouseZone } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Wind, Lightbulb, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoneCardProps {
  zone: GreenhouseZone
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const statusColors = {
    active: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    offline: "bg-destructive/10 text-destructive border-destructive/20",
  }

  const metrics = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: `${zone.temperature.current}°C`,
      target: `${zone.temperature.target}°C`,
      status: Math.abs(zone.temperature.current - zone.temperature.target) > 2 ? "warning" : "normal",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${zone.humidity.current}%`,
      target: `${zone.humidity.target}%`,
      status: Math.abs(zone.humidity.current - zone.humidity.target) > 10 ? "warning" : "normal",
    },
    {
      icon: Wind,
      label: "Ventilation",
      value: `${zone.ventilation.percentage}%`,
      target: zone.ventilation.status,
      status: "normal",
    },
    {
      icon: Lightbulb,
      label: "Light",
      value: `${zone.light.current} ${zone.light.unit}`,
      target: `${zone.light.target} ${zone.light.unit}`,
      status: "normal",
    },
  ]

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50">
      <Link href={`/zone/${zone.id}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{zone.name}</h3>
              <p className="text-sm text-muted-foreground">Zone ID: {zone.id}</p>
            </div>
            <Badge className={cn("border", statusColors[zone.status])}>{zone.status}</Badge>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <metric.icon className="h-4 w-4" />
                  <span className="text-xs">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-lg font-semibold", metric.status === "warning" && "text-warning")}>
                    {metric.value}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {metric.target}</span>
                </div>
              </div>
            ))}
          </div>

          {/* View Details Link */}
          <div className="mt-4 flex items-center justify-end gap-2 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </Card>
  )
}
