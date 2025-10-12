"use client"

import Link from "next/link"
import type { GreenhouseZone } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Wind, Lightbulb, ArrowRight, Sprout, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoneCardProps {
  zone: GreenhouseZone
  cropType?: string
}

export function ZoneCard({ zone, cropType }: ZoneCardProps) {
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
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <Link href={`/zone/${zone.id}`} className="flex-1">
            <div>
              <h3 className="text-base font-semibold sm:text-lg">{zone.name}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">Zone ID: {zone.id}</p>
              {cropType && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500">
                  <Sprout className="h-3 w-3" />
                  <span>{cropType}</span>
                </div>
              )}
            </div>
          </Link>
          <Badge className={cn("border", statusColors[zone.status])}>{zone.status}</Badge>
        </div>

        {/* Metrics Grid */}
        <Link href={`/zone/${zone.id}`}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <metric.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <span
                    className={cn("text-base font-semibold sm:text-lg", metric.status === "warning" && "text-warning")}
                  >
                    {metric.value}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {metric.target}</span>
                </div>
              </div>
            ))}
          </div>
        </Link>

        <div className="mt-4 flex items-center gap-2">
          <Link href={`/zone/${zone.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
              <span>View Details</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Link href={`/zone/${zone.id}/simulate`}>
            <Button variant="default" size="sm" className="gap-2">
              <Play className="h-3 w-3" />
              <span className="hidden sm:inline">Simulate</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
