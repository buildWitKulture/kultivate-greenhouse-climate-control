import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { mockGreenhouseZones, generateHistoricalData } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react"

export default function AnalyticsPage() {
  const zone1Data = generateHistoricalData("zone-1")
  const zone2Data = generateHistoricalData("zone-2")

  const insights = [
    {
      title: "Temperature Optimization",
      value: "+12%",
      trend: "up",
      description: "Energy efficiency improved",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Water Usage",
      value: "-8%",
      trend: "down",
      description: "Reduced consumption",
      icon: TrendingDown,
      color: "text-accent",
    },
    {
      title: "Yield Prediction",
      value: "+15%",
      trend: "up",
      description: "Above target growth",
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "System Alerts",
      value: "3",
      trend: "neutral",
      description: "Requires attention",
      icon: AlertCircle,
      color: "text-warning",
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="mt-16 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Comprehensive insights and performance metrics across all greenhouse zones
              </p>
            </div>

            {/* Key Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {insights.map((insight) => (
                <Card key={insight.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{insight.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{insight.value}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className={`rounded-lg bg-muted p-3 ${insight.color}`}>
                      <insight.icon className="h-5 w-5" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Comparative Analysis */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Comparative Zone Analysis</h3>
              <TimeSeriesChart
                title="Temperature Comparison - Zone 1 vs Zone 2"
                data={[
                  {
                    name: "Zone 1",
                    data: zone1Data.temperature,
                    color: "#0ea5e9",
                  },
                  {
                    name: "Zone 2",
                    data: zone2Data.temperature,
                    color: "#f59e0b",
                  },
                ]}
                yAxisLabel="°C"
                height={300}
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-4 lg:grid-cols-2">
              <TimeSeriesChart
                title="Humidity Trends"
                data={[
                  {
                    name: "Zone 1",
                    data: zone1Data.humidity,
                    color: "#0ea5e9",
                  },
                  {
                    name: "Zone 2",
                    data: zone2Data.humidity,
                    color: "#10b981",
                  },
                ]}
                yAxisLabel="%"
                height={250}
              />

              <TimeSeriesChart
                title="CO₂ Levels"
                data={[
                  {
                    name: "Zone 1",
                    data: zone1Data.co2,
                    color: "#10b981",
                  },
                  {
                    name: "Zone 2",
                    data: zone2Data.co2,
                    color: "#8b5cf6",
                  },
                ]}
                yAxisLabel="ppm"
                height={250}
              />
            </div>

            {/* Zone Performance Summary */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Zone Performance Summary</h3>
              <div className="space-y-4">
                {mockGreenhouseZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Temp: {zone.temperature.current}°C | Humidity: {zone.humidity.current}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          zone.status === "active"
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-warning/20 bg-warning/10 text-warning"
                        }
                      >
                        {zone.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">98%</p>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
