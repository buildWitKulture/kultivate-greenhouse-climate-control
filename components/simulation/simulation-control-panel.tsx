"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSimulationStore } from "@/lib/simulation-store"
import { Play, Pause, RotateCcw, Zap } from "lucide-react"
import { useState } from "react"

export function SimulationControlPanel() {
  const { isSimulating, simulationMode, startSimulation, stopSimulation, resetAll } = useSimulationStore()
  const [selectedScenario, setSelectedScenario] = useState<string>("normal")

  const scenarios = [
    { value: "normal", label: "Normal Conditions", description: "Standard operating parameters" },
    { value: "heatwave", label: "Heatwave", description: "High temperature stress test" },
    { value: "cold", label: "Cold Snap", description: "Low temperature scenario" },
    { value: "humid", label: "High Humidity", description: "Moisture stress conditions" },
    { value: "dry", label: "Drought", description: "Low humidity scenario" },
    { value: "custom", label: "Custom", description: "Manual parameter adjustment" },
  ]

  const handleStartSimulation = () => {
    startSimulation(selectedScenario as any)
  }

  const handleStopSimulation = () => {
    stopSimulation()
  }

  const handleReset = () => {
    resetAll()
    stopSimulation()
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Simulation Control</h3>
              <p className="text-sm text-muted-foreground">Test scenarios and adjust parameters</p>
            </div>
          </div>
          {isSimulating && (
            <Badge className="border-primary/20 bg-primary/10 text-primary" variant="outline">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
              Active
            </Badge>
          )}
        </div>

        {/* Scenario Selection */}
        <div className="space-y-2">
          <Label htmlFor="scenario">Simulation Scenario</Label>
          <Select value={selectedScenario} onValueChange={setSelectedScenario} disabled={isSimulating}>
            <SelectTrigger id="scenario">
              <SelectValue placeholder="Select a scenario" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.value} value={scenario.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{scenario.label}</span>
                    <span className="text-xs text-muted-foreground">{scenario.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Scenario Info */}
        {isSimulating && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Running: {scenarios.find((s) => s.value === simulationMode.scenario)?.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {scenarios.find((s) => s.value === simulationMode.scenario)?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isSimulating ? (
            <Button onClick={handleStartSimulation} className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Start Simulation
            </Button>
          ) : (
            <Button onClick={handleStopSimulation} variant="destructive" className="flex-1 gap-2">
              <Pause className="h-4 w-4" />
              Stop Simulation
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Advanced Options */}
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-adjust">Auto-adjust Controls</Label>
              <p className="text-xs text-muted-foreground">Automatically adjust systems based on scenario</p>
            </div>
            <Switch id="auto-adjust" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="real-time">Real-time Updates</Label>
              <p className="text-xs text-muted-foreground">Update parameters in real-time</p>
            </div>
            <Switch id="real-time" defaultChecked />
          </div>
        </div>
      </div>
    </Card>
  )
}
