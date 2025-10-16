"use client";

import { use, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  useGreenhouse,
  startSimulation,
  stopSimulation,
} from "@/lib/firebase-hooks";
import { getAllScenarios } from "@/lib/simulation-scenarios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Play, Square, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SimulatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { greenhouse, loading } = useGreenhouse(id);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const scenarios = getAllScenarios();

  useEffect(() => {
    if (!greenhouse) return;

    if (
      greenhouse.simulation?.active &&
      greenhouse.simulation?.status === "running"
    ) {
      const elapsed = (Date.now() - greenhouse.simulation?.startTime) / 1000;
      const remaining = Math.max(0, greenhouse.simulation?.duration - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        stopSimulation(id);
        return;
      }

      const interval = setInterval(() => {
        const newElapsed =
          (Date.now() - greenhouse.simulation?.startTime) / 1000;
        const newRemaining = Math.max(
          0,
          greenhouse.simulation?.duration - newElapsed
        );
        setTimeRemaining(newRemaining);

        if (newRemaining <= 0) {
          stopSimulation(id);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [greenhouse, id]);

  const handleStartSimulation = async () => {
    if (!selectedScenario) return;
    await startSimulation(id, selectedScenario);
  };

  const handleStopSimulation = async () => {
    await stopSimulation(id);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!greenhouse) {
    return (
      <AppLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Greenhouse not found</p>
        </div>
      </AppLayout>
    );
  }

  const isSimulating =
    greenhouse.simulation?.active &&
    greenhouse.simulation?.status === "running";
  const progress = isSimulating
    ? ((greenhouse.simulation?.duration - timeRemaining) /
        greenhouse.simulation?.duration) *
      100
    : 0;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            Climate Simulation
          </h2>
          <p className="text-pretty text-muted-foreground">
            Test actuator responses to different climate scenarios
          </p>
        </div>

        {isSimulating && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    Simulation in progress: {greenhouse.simulation?.type}
                  </span>
                  <Badge>{timeRemaining.toFixed(1)}s remaining</Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary/50"
              } ${isSimulating ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => !isSimulating && setSelectedScenario(scenario.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{scenario.icon}</span>
                    {scenario.name}
                  </CardTitle>
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Temp:</span>{" "}
                    <span className="font-medium">
                      {scenario.conditions?.temperature}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Humidity:</span>{" "}
                    <span className="font-medium">
                      {scenario.conditions?.humidity}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Soil:</span>{" "}
                    <span className="font-medium">
                      {scenario.conditions?.soilMoisture}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CO₂:</span>{" "}
                    <span className="font-medium">
                      {scenario.conditions?.gasLevel} ppm
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Expected Actuators:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scenario.expectedActuators.map((actuator) => (
                      <Badge
                        key={actuator}
                        variant="outline"
                        className="text-xs"
                      >
                        {actuator}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleStartSimulation}
            disabled={!selectedScenario || isSimulating}
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Simulation
          </Button>
          {isSimulating && (
            <Button
              onClick={handleStopSimulation}
              variant="destructive"
              size="lg"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Simulation
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
