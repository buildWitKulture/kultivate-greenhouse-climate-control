"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Activity, TrendingUp, Clock, Zap, RotateCcw, Play } from "lucide-react"
import type { GreenhouseZone, EfficiencySimulation } from "@/lib/types"
import { cropOptimalConditions } from "@/lib/crop-conditions"
import { calculateEfficiencySimulation } from "@/lib/efficiency-calculator"

interface EfficiencySimulatorProps {
  zone: GreenhouseZone
  cropType: string
}

export function EfficiencySimulator({ zone, cropType }: EfficiencySimulatorProps) {
  const [currentZone, setCurrentZone] = useState<GreenhouseZone>(zone)
  const [simulation, setSimulation] = useState<EfficiencySimulation | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const optimalConditions = cropOptimalConditions[cropType.toLowerCase()]

  useEffect(() => {
    if (isSimulating) {
      const sim = calculateEfficiencySimulation(currentZone, optimalConditions)
      setSimulation(sim)
    }
  }, [currentZone, isSimulating, optimalConditions])

  const handleReset = () => {
    setCurrentZone(zone)
    setIsSimulating(false)
    setSimulation(null)
  }

  const handleStartSimulation = () => {
    setIsSimulating(true)
    const sim = calculateEfficiencySimulation(currentZone, optimalConditions)
    setSimulation(sim)
  }

  const updateParameter = (param: string, value: number) => {
    setCurrentZone((prev) => {
      const newZone = { ...prev }
      if (param === "temperature") {
        newZone.temperature = { ...prev.temperature, current: value }
      } else if (param === "humidity") {
        newZone.humidity = { ...prev.humidity, current: value }
      } else if (param === "co2") {
        newZone.co2 = { ...prev.co2, current: value }
      } else if (param === "light") {
        newZone.light = { ...prev.light, current: value }
      }
      return newZone
    })
  }

  const getStatusColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const }
    if (score >= 60) return { label: "Good", variant: "secondary" as const }
    return { label: "Needs Attention", variant: "destructive" as const }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Control System Efficiency Simulator</h3>
              <p className="text-sm text-muted-foreground">
                Test recovery efficiency for {optimalConditions.cropType} cultivation
              </p>
            </div>
          </div>
          {isSimulating && simulation && (
            <Badge variant={getStatusBadge(simulation.efficiencyScore).variant} className="w-fit">
              {getStatusBadge(simulation.efficiencyScore).label}
            </Badge>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Conditions Control */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Set Current Conditions</h4>
              <Button onClick={handleReset} variant="outline" size="sm" className="gap-2 bg-transparent">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>

            {/* Temperature Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{currentZone.temperature.current.toFixed(1)}°C</span>
                  <Badge variant="outline" className="text-xs">
                    Target: {optimalConditions.temperature.optimal}°C
                  </Badge>
                </div>
              </div>
              <Slider
                value={[currentZone.temperature.current]}
                onValueChange={([value]) => updateParameter("temperature", value)}
                min={10}
                max={35}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10°C</span>
                <span>35°C</span>
              </div>
            </div>

            {/* Humidity Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Humidity</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{currentZone.humidity.current.toFixed(0)}%</span>
                  <Badge variant="outline" className="text-xs">
                    Target: {optimalConditions.humidity.optimal}%
                  </Badge>
                </div>
              </div>
              <Slider
                value={[currentZone.humidity.current]}
                onValueChange={([value]) => updateParameter("humidity", value)}
                min={30}
                max={95}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>30%</span>
                <span>95%</span>
              </div>
            </div>

            {/* CO2 Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>CO₂ Level</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{currentZone.co2.current} ppm</span>
                  <Badge variant="outline" className="text-xs">
                    Target: {optimalConditions.co2.optimal} ppm
                  </Badge>
                </div>
              </div>
              <Slider
                value={[currentZone.co2.current]}
                onValueChange={([value]) => updateParameter("co2", value)}
                min={400}
                max={1500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>400 ppm</span>
                <span>1500 ppm</span>
              </div>
            </div>

            {/* Light Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Light Intensity</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{currentZone.light.current} μmol</span>
                  <Badge variant="outline" className="text-xs">
                    Target: {optimalConditions.light.optimal} μmol
                  </Badge>
                </div>
              </div>
              <Slider
                value={[currentZone.light.current]}
                onValueChange={([value]) => updateParameter("light", value)}
                min={0}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 μmol</span>
                <span>500 μmol</span>
              </div>
            </div>

            <Button onClick={handleStartSimulation} className="w-full gap-2">
              <Play className="h-4 w-4" />
              Run Efficiency Simulation
            </Button>
          </div>
        </Card>

        {/* Simulation Results */}
        <Card className="p-6">
          <div className="space-y-6">
            <h4 className="font-semibold">Control System Response</h4>

            {!isSimulating ? (
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <Zap className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Adjust conditions and run simulation
                    <br />
                    to see control system response
                  </p>
                </div>
              </div>
            ) : simulation ? (
              <div className="space-y-6">
                {/* Efficiency Score */}
                <div className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Efficiency</span>
                    <span className={`text-2xl font-bold ${getStatusColor(simulation.efficiencyScore)}`}>
                      {simulation.efficiencyScore.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={simulation.efficiencyScore} className="h-2" />
                </div>

                {/* Recovery Time */}
                <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Estimated Recovery Time</p>
                    <p className="text-xs text-muted-foreground">Time to reach optimal conditions</p>
                  </div>
                  <span className="text-lg font-bold">{simulation.estimatedRecoveryTime.toFixed(0)} min</span>
                </div>

                {/* Control System Actions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Required Actions</span>
                  </div>

                  {simulation.controlSystemResponse.length === 0 ? (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                      <p className="text-sm font-medium text-emerald-500">Conditions are optimal!</p>
                      <p className="text-xs text-emerald-500/80">No adjustments needed</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {simulation.controlSystemResponse.map((response, index) => (
                        <div key={index} className="rounded-lg border bg-card p-3">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{response.system}</p>
                              <p className="text-xs text-muted-foreground">{response.action}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {response.timeToEffect.toFixed(0)} min
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Intensity</span>
                              <span className="font-medium">{response.intensity.toFixed(0)}%</span>
                            </div>
                            <Progress value={response.intensity} className="h-1.5" />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">Impact: {response.estimatedImpact}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
