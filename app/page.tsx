"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { useGreenhouses } from "@/lib/firebase-hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Thermometer, Droplets, Sprout, Wind } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { greenhouses, loading } = useGreenhouses()

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-pretty text-muted-foreground">Monitor and control your greenhouse climate systems</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {greenhouses.map((greenhouse) => (
            <Card key={greenhouse.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{greenhouse.name}</CardTitle>
                  <Badge variant={greenhouse.mode === "normal" ? "default" : "secondary"}>
                    {greenhouse.mode === "normal" ? "Normal" : "Simulation"}
                  </Badge>
                </div>
                <CardDescription>
                  Last update: {new Date(greenhouse.sensors.lastUpdate).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-chart-1" />
                    <div>
                      <div className="text-xs text-muted-foreground">Temperature</div>
                      <div className="font-semibold">{greenhouse.sensors.temperature}°C</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-chart-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                      <div className="font-semibold">{greenhouse.sensors.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-chart-3" />
                    <div>
                      <div className="text-xs text-muted-foreground">Soil</div>
                      <div className="font-semibold">{greenhouse.sensors.soilMoisture}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-chart-4" />
                    <div>
                      <div className="text-xs text-muted-foreground">CO₂</div>
                      <div className="font-semibold">{greenhouse.sensors.gasLevel} ppm</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={`/greenhouse/${greenhouse.id}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
                    <Link href={`/greenhouse/${greenhouse.id}/simulate`}>Simulate</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {greenhouses.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No greenhouses found. Initialize the database to get started.</p>
              <Button asChild className="mt-4">
                <Link href="/init-firebase">Initialize Database</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
