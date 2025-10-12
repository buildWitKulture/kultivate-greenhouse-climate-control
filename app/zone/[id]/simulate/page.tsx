"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { ScenarioSelector } from "@/components/simulation/scenario-selector"
import { SimulationRunner } from "@/components/simulation/simulation-runner"
import { getZoneById } from "@/lib/mock-data"
import { createSimulationRun } from "@/lib/simulation-runner"
import type { SimulationScenario, SimulationRun } from "@/lib/types"

export default function SimulatePage() {
  const params = useParams()
  const router = useRouter()
  const zoneId = params.id as string
  const zone = getZoneById(zoneId)

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null)
  const [simulationRun, setSimulationRun] = useState<SimulationRun | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  if (!zone) {
    return <div>Zone not found</div>
  }

  const cropType = zone.name.includes("1") ? "pepper" : "tomato"

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario)
    setSimulationRun(null)
    setIsComplete(false)
  }

  const handleStartSimulation = () => {
    if (!selectedScenario) return
    const run = createSimulationRun(zone, selectedScenario, cropType)
    setSimulationRun(run)
  }

  const handleComplete = () => {
    setIsComplete(true)
    console.log("[v0] Simulation completed successfully")
    console.log("[v0] Returning to normal operation")
  }

  const handleCancel = () => {
    setSimulationRun(null)
    setSelectedScenario(null)
    setIsComplete(false)
  }

  const handleReset = () => {
    setSimulationRun(null)
    setSelectedScenario(null)
    setIsComplete(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-2 gap-2 px-0">
              <ArrowLeft className="h-4 w-4" />
              Back to {zone.name}
            </Button>
            <h1 className="text-2xl font-bold sm:text-3xl">Climate Simulation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Test control system response to various climate scenarios
            </p>
          </div>
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-500">Simulation Complete</h3>
                <p className="text-sm text-emerald-500/80">
                  Control system has successfully responded to simulated conditions. Normal operation resumed.
                </p>
              </div>
              <Button onClick={handleReset} variant="outline">
                Run Another
              </Button>
            </div>
          </div>
        )}

        {/* Scenario Selection */}
        {!simulationRun && !isComplete && (
          <>
            <ScenarioSelector onSelectScenario={handleSelectScenario} selectedScenarioId={selectedScenario?.id} />

            {selectedScenario && (
              <div className="flex justify-center">
                <Button onClick={handleStartSimulation} size="lg" className="gap-2">
                  Prepare Simulation
                </Button>
              </div>
            )}
          </>
        )}

        {/* Simulation Runner */}
        {simulationRun && !isComplete && (
          <SimulationRunner simulationRun={simulationRun} onComplete={handleComplete} onCancel={handleCancel} />
        )}
      </div>
    </div>
  )
}
