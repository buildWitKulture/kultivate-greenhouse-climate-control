"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { mockWeatherData } from "@/lib/mock-data"
import { Cloud, CloudRain, Sun } from "lucide-react"

export function WeatherScenarios() {
  // Prepare chart data
  const temperatureData = mockWeatherData.map((d) => ({
    timestamp: d.timestamp,
    value: d.temperature,
  }))

  const humidityData = mockWeatherData.map((d) => ({
    timestamp: d.timestamp,
    value: d.humidity,
  }))

  const windSpeedData = mockWeatherData.map((d) => ({
    timestamp: d.timestamp,
    value: d.windSpeed,
  }))

  const solarRadiationData = mockWeatherData.map((d) => ({
    timestamp: d.timestamp,
    value: d.solarRadiation,
  }))

  const scenarios = [
    {
      id: "normal",
      name: "Normal Conditions",
      icon: Sun,
      description: "Standard weather patterns",
      active: true,
    },
    {
      id: "heatwave",
      name: "Heatwave",
      icon: Sun,
      description: "High temperature scenario",
      active: false,
    },
    {
      id: "storm",
      name: "Storm",
      icon: CloudRain,
      description: "Heavy rain and wind",
      active: false,
    },
    {
      id: "cloudy",
      name: "Overcast",
      icon: Cloud,
      description: "Low light conditions",
      active: false,
    },
  ]

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Scenario Selection */}
      <Card className="p-4 lg:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold lg:text-lg">Weather Scenarios</h3>
            <p className="text-xs text-muted-foreground lg:text-sm">
              Select or customize weather conditions for simulation
            </p>
          </div>
          <Badge className="w-fit border-accent/20 bg-accent/10 text-accent" variant="outline">
            Custom Scenarios
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={scenario.active ? "default" : "outline"}
              className="h-auto flex-col items-start gap-2 p-3 lg:p-4"
            >
              <scenario.icon className="h-4 w-4 lg:h-5 lg:w-5" />
              <div className="text-left">
                <div className="text-xs font-semibold lg:text-sm">{scenario.name}</div>
                <div className="text-xs opacity-80">{scenario.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Weather Data Charts */}
      <Tabs defaultValue="day" className="w-full">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-4">
          <h3 className="text-base font-semibold lg:text-lg">Historical Weather Data</h3>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="day" className="text-xs lg:text-sm">
              Day
            </TabsTrigger>
            <TabsTrigger value="3days" className="text-xs lg:text-sm">
              3 Days
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs lg:text-sm">
              Week
            </TabsTrigger>
            <TabsTrigger value="today" className="text-xs lg:text-sm">
              Today
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="day" className="space-y-4">
          <TimeSeriesChart
            title="Temperature & Humidity"
            data={[
              {
                name: "Temperature (°C)",
                data: temperatureData,
                color: "#f59e0b",
              },
              {
                name: "Humidity (%)",
                data: humidityData,
                color: "#0ea5e9",
              },
            ]}
            height={300}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title="Wind Speed"
              data={[
                {
                  name: "Wind Speed (m/s)",
                  data: windSpeedData,
                  color: "#10b981",
                },
              ]}
              yAxisLabel="m/s"
              height={250}
            />

            <TimeSeriesChart
              title="Solar Radiation"
              data={[
                {
                  name: "Solar Radiation (W/m²)",
                  data: solarRadiationData,
                  color: "#f59e0b",
                },
              ]}
              yAxisLabel="W/m²"
              height={250}
            />
          </div>
        </TabsContent>

        <TabsContent value="3days">
          <p className="text-center text-sm text-muted-foreground">3-day historical data view</p>
        </TabsContent>

        <TabsContent value="week">
          <p className="text-center text-sm text-muted-foreground">Weekly historical data view</p>
        </TabsContent>

        <TabsContent value="today">
          <p className="text-center text-sm text-muted-foreground">Today's data view</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
