// components/simulation/scenario-selector.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllScenarios,
  type SimulationScenario,
} from "@/lib/simulation-scenarios";
import { ChevronRight, Info } from "lucide-react";

interface ScenarioSelectorProps {
  onSelect: (scenarioId: string) => void;
  selectedScenario?: string;
}

export default function ScenarioSelector({
  onSelect,
  selectedScenario,
}: ScenarioSelectorProps) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const scenarios = getAllScenarios();

  const toggleExpand = (scenarioId: string) => {
    setExpandedScenario(expandedScenario === scenarioId ? null : scenarioId);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Climate Scenario</h3>
        <p className="text-sm text-muted-foreground">
          Choose a climate condition to simulate greenhouse response
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedScenario === scenario.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect(scenario.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{scenario.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {scenario.description}
                    </CardDescription>
                  </div>
                </div>
                {selectedScenario === scenario.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Condition Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">Temp:</span>
                  <span className="font-semibold">
                    {scenario.conditions.temperature}°C
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span className="font-semibold">
                    {scenario.conditions.humidity}%
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">Soil:</span>
                  <span className="font-semibold">
                    {scenario.conditions.soilMoisture}%
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="text-muted-foreground">CO₂:</span>
                  <span className="font-semibold">
                    {scenario.conditions.gasLevel} ppm
                  </span>
                </div>
              </div>

              {/* Active Systems Preview */}
              <div className="flex flex-wrap gap-1">
                {Object.entries(scenario.expectedActuators)
                  .filter(([_, active]) => active)
                  .map(([actuator]) => (
                    <Badge
                      key={actuator}
                      variant="secondary"
                      className="text-xs"
                    >
                      {actuator}
                    </Badge>
                  ))}
              </div>

              {/* Details Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(scenario.id);
                }}
              >
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  View Details
                </span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    expandedScenario === scenario.id ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {/* Expanded Details */}
              {expandedScenario === scenario.id && (
                <div className="pt-3 border-t space-y-2">
                  <h4 className="font-semibold text-sm">System Response:</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {scenario.reasoning.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
