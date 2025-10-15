"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Zap } from "lucide-react"
import ScenarioSelector from "@/components/simulation/scenario-selector"
import SimulationRunner from "@/components/simulation/simulation-runner"
import { subscribeToGreenhouse, type GreenhouseData } from "@/lib/firebase-config"

interface SimulatePageProps {
  params: Promise<{
    id: string
  }>
}

export default function SimulatePage({ params }: SimulatePageProps) {
  const router = useRouter()
  const [step, setStep] = useState<"select" | "run">("select")
  const [selectedScenario, setSelectedScenario] = useState<string>("")
  const [greenhouseData, setGreenhouseData] = useState<GreenhouseData | null>(null)
  const [zoneId, setZoneId] = useState<string>("")

  useEffect(() => {
    params.then((unwrappedParams) => {
      setZoneId(unwrappedParams.id)
    })
  }, [params])

  // Subscribe to greenhouse data
  useEffect(() => {
    if (!zoneId) return

    const unsubscribe = subscribeToGreenhouse(zoneId, (data) => {
      Promise.resolve().then(() => setGreenhouseData(data))
    })

    return () => unsubscribe()
  }, [zoneId])

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
  }

  const handleStartSimulation = () => {
    if (selectedScenario) {
      setStep("run")
    }
  }

  const handleSimulationComplete = () => {
    console.log("Simulation completed")
  }

  const handleBackToSelection = () => {
    setStep("select")
    setSelectedScenario("")
  }

  if (!zoneId) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Climate Simulation
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Zone {zoneId} - Test system response to extreme conditions
            </p>
          </div>
        </div>

        {step === "run" && (
          <Button variant="outline" onClick={handleBackToSelection}>
            Change Scenario
          </Button>
        )}
      </div>

      {/* Current Status Alert */}
      {greenhouseData && !greenhouseData.simulation.active && (
        <Alert>
          <AlertDescription className="text-sm">
            System is in normal operation mode. Temperature: {greenhouseData.sensors.temperature}°C, Humidity:{" "}
            {greenhouseData.sensors.humidity}%, Soil Moisture: {greenhouseData.sensors.soilMoisture}%
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      {step === "select" ? (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Choose Simulation Scenario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScenarioSelector onSelect={handleScenarioSelect} selectedScenario={selectedScenario} />

            {selectedScenario && (
              <div className="flex justify-end pt-4 border-t">
                <Button size="lg" onClick={handleStartSimulation} className="min-w-[200px]">
                  Continue to Simulation
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <SimulationRunner zoneId={zoneId} selectedScenario={selectedScenario} onComplete={handleSimulationComplete} />
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>How Simulation Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Simulation Process:</h4>
              <ol className="space-y-1 text-muted-foreground">
                <li>1. Select a climate scenario</li>
                <li>2. Review expected system responses</li>
                <li>3. Start 10-second simulation</li>
                <li>4. Monitor real-time actuator responses</li>
                <li>5. System returns to normal operation</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Safety Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Fixed 10-second duration</li>
                <li>• Manual stop capability</li>
                <li>• Automatic return to normal</li>
                <li>• Complete activity logging</li>
                <li>• ESP32 synchronized control</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
