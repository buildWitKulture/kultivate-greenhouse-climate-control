import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { WeatherOverview } from "@/components/weather/weather-overview"
import { WeatherScenarios } from "@/components/weather/weather-scenarios"
import { mockWeatherData } from "@/lib/mock-data"

export default function WeatherPage() {
  const currentWeather = mockWeatherData[mockWeatherData.length - 1]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="mt-16 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Weather Monitoring</h2>
              <p className="text-muted-foreground">Track external weather conditions and simulate custom scenarios</p>
            </div>

            {/* Current Weather */}
            <WeatherOverview currentWeather={currentWeather} />

            {/* Weather Scenarios and Charts */}
            <WeatherScenarios />
          </div>
        </main>
      </div>
    </div>
  )
}
