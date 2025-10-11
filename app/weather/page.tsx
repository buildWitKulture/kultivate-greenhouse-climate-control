import { AppLayout } from "@/components/layout/app-layout"
import { WeatherOverview } from "@/components/weather/weather-overview"
import { WeatherScenarios } from "@/components/weather/weather-scenarios"
import { mockWeatherData } from "@/lib/mock-data"

export default function WeatherPage() {
  const currentWeather = mockWeatherData[mockWeatherData.length - 1]

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
        <WeatherOverview currentWeather={currentWeather} />

        {/* Weather Scenarios and Charts */}
        <WeatherScenarios />
      </div>
    </AppLayout>
  )
}
