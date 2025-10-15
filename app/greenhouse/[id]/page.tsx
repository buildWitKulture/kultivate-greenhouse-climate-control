"use client"

import { use } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { useGreenhouse } from "@/lib/firebase-hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Thermometer,
  Droplets,
  Sprout,
  Wind,
  Fan,
  Droplet,
  Flame,
  CloudRain,
  Lightbulb,
  CogIcon as Co2Icon,
} from "lucide-react"
import Link from "next/link"

export default function GreenhousePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { greenhouse, loading } = useGreenhouse(id)

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  if (!greenhouse) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Greenhouse not found</p>
        </div>
      </AppLayout>
    )
  }

  const actuators =
    greenhouse.mode === "simulation" ? greenhouse.simulation.actuatorStates : greenhouse.normalMode.actuatorStates

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight">{greenhouse.name}</h2>
            <p className="text-pretty text-muted-foreground">Real-time monitoring and control</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={greenhouse.mode === "normal" ? "default" : "secondary"} className="h-fit">
              {greenhouse.mode === "normal" ? "Normal Mode" : "Simulation Mode"}
            </Badge>
            <Button asChild>
              <Link href={`/greenhouse/${id}/simulate`}>Run Simulation</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{greenhouse.sensors.temperature}°C</div>
              <p className="text-xs text-muted-foreground">
                Target: {greenhouse.normalMode.parameters.targetTempMin}-
                {greenhouse.normalMode.parameters.targetTempMax}°C
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{greenhouse.sensors.humidity}%</div>
              <p className="text-xs text-muted-foreground">
                Target: {greenhouse.normalMode.parameters.targetHumidityMin}-
                {greenhouse.normalMode.parameters.targetHumidityMax}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
              <Sprout className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{greenhouse.sensors.soilMoisture}%</div>
              <p className="text-xs text-muted-foreground">
                Target: {greenhouse.normalMode.parameters.targetSoilMoistureMin}-
                {greenhouse.normalMode.parameters.targetSoilMoistureMax}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Level</CardTitle>
              <Wind className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{greenhouse.sensors.gasLevel} ppm</div>
              <p className="text-xs text-muted-foreground">Optimal: 400-600 ppm</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actuator Status</CardTitle>
            <CardDescription>Current state of all control systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ActuatorStatus icon={Fan} label="Ventilation Fan" active={actuators.fan} />
              <ActuatorStatus icon={Droplet} label="Irrigation Pump" active={actuators.pump} />
              <ActuatorStatus icon={Flame} label="Heater" active={actuators.heater} />
              <ActuatorStatus icon={CloudRain} label="Misting System" active={actuators.misting} />
              <ActuatorStatus icon={Lightbulb} label="Grow Lights" active={actuators.lighting} />
              <ActuatorStatus icon={Co2Icon} label="CO₂ Dosing" active={actuators.co2dosing} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

function ActuatorStatus({ icon: Icon, label, active }: { icon: any; label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className={`rounded-full p-2 ${active ? "bg-primary/10" : "bg-muted"}`}>
        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className={`text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>
          {active ? "Active" : "Inactive"}
        </div>
      </div>
    </div>
  )
}
