// components/simulation/simulation-runner.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Square,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  Sprout,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  getScenarioById,
  calculateActuatorResponse,
} from "@/lib/simulation-scenarios";
import {
  startSimulation,
  stopSimulation,
  updateSensorReadings,
  updateActuators,
  addSimulationLog,
  subscribeToSimulation,
  subscribeToGreenhouse,
  type GreenhouseData,
} from "@/lib/firebase-config";

interface SimulationRunnerProps {
  zoneId: string;
  selectedScenario: string;
  onComplete?: () => void;
}

export default function SimulationRunner({
  zoneId,
  selectedScenario,
  onComplete,
}: SimulationRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [progress, setProgress] = useState(0);
  const [currentConditions, setCurrentConditions] = useState<
    GreenhouseData["sensors"] | null
  >(null);
  const [activeActuators, setActiveActuators] = useState<
    GreenhouseData["actuators"] | null
  >(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const scenario = getScenarioById(selectedScenario);

  // Subscribe to Firebase updates
  useEffect(() => {
    if (!zoneId) return;

    const unsubscribeSimulation = subscribeToSimulation(
      zoneId,
      (simulation) => {
        setIsRunning(simulation.active && simulation.status === "running");

        if (simulation.status === "complete" && simulation.active === false) {
          setSimulationComplete(true);
          setTimeRemaining(0);
          setProgress(100);
        }
      }
    );

    const unsubscribeGreenhouse = subscribeToGreenhouse(zoneId, (data) => {
      Promise.resolve().then(() => {
        setCurrentConditions(data.sensors);
        setActiveActuators(data.actuators);
      });
    });

    return () => {
      unsubscribeSimulation();
      unsubscribeGreenhouse();
    };
  }, [zoneId]);

  // Simulation timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          handleSimulationComplete();
          return 0;
        }
        const newTime = prev - 0.1;
        setProgress(((10 - newTime) / 10) * 100);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartSimulation = async () => {
    if (!scenario) return;

    try {
      // Add notification
      addNotification(`🚀 Starting ${scenario.name} simulation`);

      // Start simulation in Firebase
      await startSimulation(zoneId, scenario.id as any);

      // Update sensor readings to simulation conditions
      await updateSensorReadings(zoneId, scenario.conditions);

      // Calculate and apply actuator responses
      const actuatorResponse = calculateActuatorResponse(
        scenario.conditions.temperature,
        scenario.conditions.humidity,
        scenario.conditions.soilMoisture,
        scenario.conditions.gasLevel
      );
      await updateActuators(zoneId, actuatorResponse);

      // Add actuator notifications
      if (actuatorResponse.fan)
        addNotification("💨 Ventilation fans activated");
      if (actuatorResponse.pump)
        addNotification("💧 Irrigation system started");
      if (actuatorResponse.heater)
        addNotification("🔥 Heating system activated");
      if (actuatorResponse.misting)
        addNotification("💦 Misting system engaged");
      if (actuatorResponse.lighting)
        addNotification("💡 Supplemental lighting on");
      if (actuatorResponse.co2dosing)
        addNotification("🌱 CO₂ dosing activated");

      setIsRunning(true);
      setTimeRemaining(10);
      setProgress(0);
      setSimulationComplete(false);
    } catch (error) {
      console.error("Failed to start simulation:", error);
      addNotification("❌ Failed to start simulation");
    }
  };

  const handleStopSimulation = async () => {
    try {
      await stopSimulation(zoneId);

      // Reset all actuators
      await updateActuators(zoneId, {
        fan: false,
        pump: false,
        heater: false,
        misting: false,
        lighting: false,
        co2dosing: false,
      });

      addNotification("⏸️ Simulation stopped manually");
      setIsRunning(false);
      setTimeRemaining(10);
      setProgress(0);
    } catch (error) {
      console.error("Failed to stop simulation:", error);
    }
  };

  const handleSimulationComplete = async () => {
    if (!scenario || !currentConditions) return;

    try {
      // Stop simulation
      await stopSimulation(zoneId);

      // Reset actuators
      await updateActuators(zoneId, {
        fan: false,
        pump: false,
        heater: false,
        misting: false,
        lighting: false,
        co2dosing: false,
      });

      // Log simulation
      const actuatorActions: string[] = [];
      if (activeActuators?.fan) actuatorActions.push("Ventilation activated");
      if (activeActuators?.pump) actuatorActions.push("Irrigation activated");
      if (activeActuators?.heater) actuatorActions.push("Heating activated");
      if (activeActuators?.misting) actuatorActions.push("Misting activated");
      if (activeActuators?.lighting) actuatorActions.push("Lighting activated");
      if (activeActuators?.co2dosing)
        actuatorActions.push("CO₂ dosing activated");

      await addSimulationLog(zoneId, {
        id: `sim_${Date.now()}`,
        timestamp: Date.now(),
        type: scenario.id,
        scenario: scenario.name,
        duration: 10000,
        startConditions: scenario.conditions,
        endConditions: currentConditions,
        actuatorActions,
        status: "completed",
      });

      addNotification("✅ Simulation completed successfully");
      addNotification("🔄 Returning to normal operation");

      setIsRunning(false);
      setSimulationComplete(true);

      if (onComplete) onComplete();
    } catch (error) {
      console.error("Failed to complete simulation:", error);
    }
  };

  const addNotification = useCallback((message: string) => {
    setNotifications((prev) => [...prev, message]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== message));
    }, 5000);
  }, []);

  if (!scenario) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Please select a simulation scenario</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scenario Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">{scenario.icon}</span>
                {scenario.name} Simulation
              </CardTitle>
              <CardDescription>{scenario.description}</CardDescription>
            </div>
            <Badge
              variant={
                isRunning
                  ? "default"
                  : simulationComplete
                  ? "outline"
                  : "secondary"
              }
              className="text-lg px-4 py-2"
            >
              {isRunning
                ? "Running"
                : simulationComplete
                ? "Complete"
                : "Ready"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Simulation Controls */}
          <div className="flex items-center gap-4">
            {!isRunning && !simulationComplete && (
              <Button
                onClick={handleStartSimulation}
                size="lg"
                className="flex-1"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Simulation
              </Button>
            )}

            {isRunning && (
              <>
                <Button
                  onClick={handleStopSimulation}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                >
                  <Square className="mr-2 h-5 w-5" />
                  Stop Simulation
                </Button>

                <div className="flex items-center gap-2 px-6 py-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-mono font-bold">
                    {timeRemaining.toFixed(1)}s
                  </span>
                </div>
              </>
            )}

            {simulationComplete && (
              <Button
                onClick={() => {
                  setSimulationComplete(false);
                  setProgress(0);
                  setTimeRemaining(10);
                }}
                size="lg"
                className="flex-1"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Run Another Simulation
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          {(isRunning || progress > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          {/* Current Conditions */}
          {currentConditions && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Thermometer className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {currentConditions.temperature}°C
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Temperature
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Droplets className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {currentConditions.humidity}%
                  </div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Sprout className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {currentConditions.soilMoisture}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Soil Moisture
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Wind className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {currentConditions.gasLevel} ppm
                  </div>
                  <div className="text-xs text-muted-foreground">CO₂ Level</div>
                </div>
              </div>
            </div>
          )}

          {/* Active Actuators */}
          {activeActuators && (
            <div>
              <h4 className="font-semibold mb-3">Active Systems</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeActuators).map(
                  ([key, active]) =>
                    active && (
                      <Badge key={key} variant="default" className="px-3 py-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Badge>
                    )
                )}
                {!Object.values(activeActuators).some((v) => v) && (
                  <span className="text-sm text-muted-foreground">
                    No systems active
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <Alert key={index} className="animate-in slide-in-from-right">
              <AlertDescription>{notification}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
