"use client"

import { Card } from "@/components/ui/card"
import { Cloud, Wind, Droplets, Sun } from "lucide-react"
import type { WeatherData } from "@/lib/types"

interface WeatherOverviewProps {
  currentWeather: WeatherData
}

export function WeatherOverview({ currentWeather }: WeatherOverviewProps) {
  const metrics = [
    {
      icon: Sun,
      label: "Temperature",
      value: `${currentWeather.temperature.toFixed(1)}°C`,
      color: "text-warning",
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${currentWeather.humidity.toFixed(0)}%`,
      color: "text-accent",
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${currentWeather.windSpeed.toFixed(1)} m/s`,
      color: "text-primary",
    },
    {
      icon: Cloud,
      label: "Rain Status",
      value: currentWeather.rainStatus,
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
            <div className={`rounded-lg bg-muted p-3 ${metric.color}`}>
              <metric.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
