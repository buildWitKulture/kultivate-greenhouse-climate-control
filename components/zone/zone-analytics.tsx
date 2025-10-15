"use client"

import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { useHistoricalData } from "@/lib/firebase-hooks"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface ZoneAnalyticsProps {
  zoneId: string
}

export function ZoneAnalytics({ zoneId }: ZoneAnalyticsProps) {
  const { data: historicalData, loading } = useHistoricalData(zoneId)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analytics & Trends</h2>
        <Tabs defaultValue="12h" className="w-auto">
          <TabsList>
            <TabsTrigger value="12h">12h</TabsTrigger>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        <TimeSeriesChart
          title="Temperature Trends"
          data={[
            {
              name: "Temperature (°C)",
              data: historicalData?.temperature,
              color: "#f59e0b",
            },
          ]}
          yAxisLabel="°C"
          height={250}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <TimeSeriesChart
            title="Humidity Levels"
            data={[
              {
                name: "Humidity (%)",
                data: historicalData?.humidity,
                color: "#0ea5e9",
              },
            ]}
            yAxisLabel="%"
            height={200}
          />

          <TimeSeriesChart
            title="CO₂ Concentration"
            data={[
              {
                name: "CO₂ (ppm)",
                data: historicalData?.co2,
                color: "#10b981",
              },
            ]}
            yAxisLabel="ppm"
            height={200}
          />
        </div>

        <TimeSeriesChart
          title="Light Intensity"
          data={[
            {
              name: "Light (μmol)",
              data: historicalData?.light,
              color: "#f59e0b",
            },
          ]}
          yAxisLabel="μmol"
          height={200}
        />
      </div>
    </div>
  )
}
