"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { WeatherOverview } from "@/components/weather/weather-overview"
import { WeatherScenarios } from "@/components/weather/weather-scenarios"
import { useWeatherData } from "@/lib/firebase-hooks"
import { Loader2 } from "lucide-react"

export default function WeatherPage() {
  const { weatherData, loading } = useWeatherData()

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  const currentWeather = weatherData[weatherData.length - 1]

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Weather Monitoring</h2>
          <p className="text-sm text-muted-foreground lg:text-base">
            Track external weather conditions and simulate custom scenarios
          </p>
        </div>

        {/* Current Weather */}
        {currentWeather && <WeatherOverview currentWeather={currentWeather} />}

        {/* Weather Scenarios and Charts */}
        <WeatherScenarios />
      </div>
    </AppLayout>
  )
}
