"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

interface ControlCardProps {
  title: string
  icon?: React.ReactNode
  status: "on" | "off" | "auto" | "manual"
  value?: number
  unit?: string
  description?: string
  onToggle?: (enabled: boolean) => void
  onValueChange?: (value: number) => void
  showSlider?: boolean
}

export function ControlCard({
  title,
  icon,
  status,
  value,
  unit,
  description,
  onToggle,
  onValueChange,
  showSlider = false,
}: ControlCardProps) {
  const isEnabled = status === "on" || status === "auto"

  const getStatusBadge = () => {
    switch (status) {
      case "on":
        return (
          <Badge className="border-primary/20 bg-primary/10 text-primary" variant="outline">
            On
          </Badge>
        )
      case "off":
        return (
          <Badge className="border-muted-foreground/20 bg-muted/10 text-muted-foreground" variant="outline">
            Off
          </Badge>
        )
      case "auto":
        return (
          <Badge className="border-accent/20 bg-accent/10 text-accent" variant="outline">
            Auto
          </Badge>
        )
      case "manual":
        return (
          <Badge className="border-warning/20 bg-warning/10 text-warning" variant="outline">
            Manual
          </Badge>
        )
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="rounded-lg bg-muted p-2">{icon}</div>}
            <div>
              <h3 className="font-semibold">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Value Display */}
        {value !== undefined && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-muted-foreground">{unit}</span>}
          </div>
        )}

        {/* Slider Control */}
        {showSlider && value !== undefined && (
          <div className="space-y-2">
            <Slider
              value={[value]}
              onValueChange={(values) => onValueChange?.(values[0])}
              max={100}
              step={1}
              className="w-full"
              disabled={!isEnabled}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={isEnabled} onCheckedChange={onToggle} />
            <span className="text-sm text-muted-foreground">{isEnabled ? "Enabled" : "Disabled"}</span>
          </div>
          <Button variant="ghost" size="sm">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
