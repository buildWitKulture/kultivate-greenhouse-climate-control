"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSimulationStore } from "@/lib/simulation-store"
import { useState } from "react"
import { Thermometer, Droplets, Wind, Sun, Flame } from "lucide-react"

interface ParameterEditorProps {
  zoneId: string
}

export function ParameterEditor({ zoneId }: ParameterEditorProps) {
  const { updateZoneParameter, modifiedZones } = useSimulationStore()
  const zoneModifications = modifiedZones.get(zoneId) || {}

  const [temperature, setTemperature] = useState(22)
  const [humidity, setHumidity] = useState(70)
  const [ventilation, setVentilation] = useState(50)
  const [lighting, setLighting] = useState(300)
  const [heating, setHeating] = useState(50)

  const handleApply = (parameter: string, value: number) => {
    updateZoneParameter(zoneId, parameter as any, value)
  }

  const parameters = [
    {
      id: "temperature",
      label: "Temperature",
      icon: Thermometer,
      value: temperature,
      setValue: setTemperature,
      min: 10,
      max: 40,
      unit: "°C",
      color: "text-warning",
    },
    {
      id: "humidity",
      label: "Humidity",
      icon: Droplets,
      value: humidity,
      setValue: setHumidity,
      min: 30,
      max: 95,
      unit: "%",
      color: "text-accent",
    },
    {
      id: "ventilation",
      label: "Ventilation",
      icon: Wind,
      value: ventilation,
      setValue: setVentilation,
      min: 0,
      max: 100,
      unit: "%",
      color: "text-primary",
    },
    {
      id: "lighting",
      label: "Lighting",
      icon: Sun,
      value: lighting,
      setValue: setLighting,
      min: 0,
      max: 500,
      unit: "μmol",
      color: "text-warning",
    },
    {
      id: "heating",
      label: "Heating",
      icon: Flame,
      value: heating,
      setValue: setHeating,
      min: 0,
      max: 100,
      unit: "%",
      color: "text-destructive",
    },
  ]

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Parameter Editor</h3>
        <p className="text-sm text-muted-foreground">Manually adjust environmental parameters</p>
      </div>

      <Tabs defaultValue="environmental" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="systems">Systems</TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-6">
          {parameters.slice(0, 2).map((param) => (
            <div key={param.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <param.icon className={`h-4 w-4 ${param.color}`} />
                  <Label htmlFor={param.id}>{param.label}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id={param.id}
                    type="number"
                    value={param.value}
                    onChange={(e) => param.setValue(Number(e.target.value))}
                    className="w-20 text-right"
                    min={param.min}
                    max={param.max}
                  />
                  <span className="text-sm text-muted-foreground">{param.unit}</span>
                </div>
              </div>
              <Slider
                value={[param.value]}
                onValueChange={(values) => param.setValue(values[0])}
                min={param.min}
                max={param.max}
                step={1}
                className="w-full"
              />
              <Button onClick={() => handleApply(param.id, param.value)} variant="outline" size="sm" className="w-full">
                Apply {param.label}
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="systems" className="space-y-6">
          {parameters.slice(2).map((param) => (
            <div key={param.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <param.icon className={`h-4 w-4 ${param.color}`} />
                  <Label htmlFor={param.id}>{param.label}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id={param.id}
                    type="number"
                    value={param.value}
                    onChange={(e) => param.setValue(Number(e.target.value))}
                    className="w-20 text-right"
                    min={param.min}
                    max={param.max}
                  />
                  <span className="text-sm text-muted-foreground">{param.unit}</span>
                </div>
              </div>
              <Slider
                value={[param.value]}
                onValueChange={(values) => param.setValue(values[0])}
                min={param.min}
                max={param.max}
                step={1}
                className="w-full"
              />
              <Button onClick={() => handleApply(param.id, param.value)} variant="outline" size="sm" className="w-full">
                Apply {param.label}
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
