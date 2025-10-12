"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, Droplet, Droplet as DropletOff, Snowflake, CloudRain, LightbulbOff, Wind } from "lucide-react"
import type { SimulationScenario } from "@/lib/types"
import { simulationScenarios } from "@/lib/simulation-scenarios"

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: SimulationScenario) => void
  selectedScenarioId?: string
}

const iconMap = {
  sun: Sun,
  droplet: Droplet,
  "droplet-off": DropletOff,
  snowflake: Snowflake,
  "cloud-rain": CloudRain,
  "lightbulb-off": LightbulbOff,
  wind: Wind,
}

export function ScenarioSelector({ onSelectScenario, selectedScenarioId }: ScenarioSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Select Climate Scenario</h3>
        <p className="text-sm text-muted-foreground">Choose a scenario to simulate control system response</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulationScenarios.map((scenario) => {
          const Icon = iconMap[scenario.icon as keyof typeof iconMap] || Sun
          const isSelected = selectedScenarioId === scenario.id

          return (
            <Card
              key={scenario.id}
              className={`cursor-pointer p-4 transition-all hover:border-primary ${
                isSelected ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold">{scenario.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{scenario.description}</p>
                </div>

                <div className="space-y-1.5 border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground">Conditions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {scenario.conditions.temperature && (
                      <Badge variant="outline" className="text-xs">
                        {scenario.conditions.temperature}°C
                      </Badge>
                    )}
                    {scenario.conditions.humidity && (
                      <Badge variant="outline" className="text-xs">
                        {scenario.conditions.humidity}% RH
                      </Badge>
                    )}
                    {scenario.conditions.soilMoisture && (
                      <Badge variant="outline" className="text-xs">
                        {scenario.conditions.soilMoisture}% Soil
                      </Badge>
                    )}
                    {scenario.conditions.light && (
                      <Badge variant="outline" className="text-xs">
                        {scenario.conditions.light} μmol
                      </Badge>
                    )}
                    {scenario.conditions.co2 && (
                      <Badge variant="outline" className="text-xs">
                        {scenario.conditions.co2} ppm
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground">Expected Actuators:</p>
                  <div className="flex flex-wrap gap-1">
                    {scenario.expectedActuators.map((actuator) => (
                      <Badge key={actuator} variant="secondary" className="text-xs">
                        {actuator}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
