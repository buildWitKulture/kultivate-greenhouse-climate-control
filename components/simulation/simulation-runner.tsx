"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef } from "react"
import { Play, Square, RotateCcw, Bell, Activity, Zap } from "lucide-react"
import type { SimulationRun, ActuatorResponse } from "@/lib/types"

interface SimulationRunnerProps {
  simulationRun: SimulationRun
  onComplete: () => void
  onCancel: () => void
}

export function SimulationRunner({ simulationRun, onComplete, onCancel }: SimulationRunnerProps) {
  const [timeRemaining, setTimeRemaining] = useState(simulationRun.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [activeActuators, setActiveActuators] = useState<ActuatorResponse[]>([])
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    if (timeRemaining === 0 && !isRunning && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete()
    }
  }, [timeRemaining, isRunning, onComplete])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return

    const elapsed = simulationRun.duration - timeRemaining

    // Activate actuators based on their scheduled time
    const newActiveActuators = simulationRun.actuatorResponses.filter(
      (response) => response.activatedAt <= elapsed && response.status !== "completed",
    )

    setActiveActuators(newActiveActuators)
  }, [timeRemaining, isRunning, simulationRun])

  const handleStart = () => {
    setIsRunning(true)
    hasCompletedRef.current = false
    console.log("[v0] Simulation started:", simulationRun.id)
    console.log("[v0] Firebase data would be sent:", {
      zoneId: simulationRun.zoneId,
      scenarioId: simulationRun.scenarioId,
      duration: simulationRun.duration,
    })
  }

  const handleStop = () => {
    setIsRunning(false)
    onCancel()
  }

  const progress = ((simulationRun.duration - timeRemaining) / simulationRun.duration) * 100

  return (
    <div className="space-y-6">
      {/* Simulation Status */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${isRunning ? "bg-emerald-500/10" : "bg-primary/10"}`}>
                <Activity className={`h-5 w-5 ${isRunning ? "text-emerald-500" : "text-primary"}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Simulation Status</h3>
                <p className="text-sm text-muted-foreground">
                  {isRunning ? "Running simulation..." : "Ready to start"}
                </p>
              </div>
            </div>
            <Badge variant={isRunning ? "default" : "secondary"} className="w-fit">
              {isRunning ? "Running" : "Pending"}
            </Badge>
          </div>

          {/* Timer Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Time Remaining</span>
              <span className="text-2xl font-bold tabular-nums">{timeRemaining}s</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0s</span>
              <span>{simulationRun.duration}s</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} className="flex-1 gap-2">
                <Play className="h-4 w-4" />
                Start Simulation
              </Button>
            ) : (
              <Button onClick={handleStop} variant="destructive" className="flex-1 gap-2">
                <Square className="h-4 w-4" />
                Stop Simulation
              </Button>
            )}
            <Button onClick={onCancel} variant="outline" size="icon" disabled={isRunning}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">Notifications</h4>
          </div>
          <div className="space-y-2">
            {simulationRun.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 ${
                  notification.type === "warning"
                    ? "border-yellow-500/20 bg-yellow-500/10"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{notification.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
            {isRunning && (
              <div className="animate-pulse rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-500">Simulation in progress - Actuators responding...</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Actuator Responses */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">Actuator Responses</h4>
          </div>

          <div className="space-y-3">
            {simulationRun.actuatorResponses.map((response, index) => {
              const isActive = activeActuators.includes(response)
              const elapsed = simulationRun.duration - timeRemaining
              const willActivate = response.activatedAt > elapsed

              return (
                <div
                  key={index}
                  className={`rounded-lg border p-4 transition-all ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500/10"
                      : willActivate
                        ? "border-muted bg-muted/50"
                        : "border-muted"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-semibold">{response.actuator}</h5>
                        {isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                        {willActivate && (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{response.action}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Trigger: {response.trigger}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{response.intensity}%</p>
                      <p className="text-xs text-muted-foreground">at {response.activatedAt}s</p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="mt-3">
                      <Progress value={response.intensity} className="h-1.5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
