"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnvironmentalGaugeProps {
  label: string
  value: number
  target: number
  min?: number
  max?: number
  unit: string
  icon?: React.ReactNode
  status?: "normal" | "warning" | "critical"
}

export function EnvironmentalGauge({
  label,
  value,
  target,
  min,
  max,
  unit,
  icon,
  status = "normal",
}: EnvironmentalGaugeProps) {
  // Calculate percentage for gauge (0-100)
  const percentage =
    min !== undefined && max !== undefined ? ((value - min) / (max - min)) * 100 : (value / target) * 100

  // Determine color based on status
  const getColor = () => {
    if (status === "critical") return "text-destructive"
    if (status === "warning") return "text-warning"
    return "text-primary"
  }

  const getStrokeColor = () => {
    if (status === "critical") return "#ef4444"
    if (status === "warning") return "#f59e0b"
    return "#10b981"
  }

  const size = 140 // Reduced from 160 for mobile
  const strokeWidth = 10 // Reduced from 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference

  return (
    <Card className="p-4 lg:p-6">
      <div className="flex flex-col items-center">
        {/* Icon and Label */}
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <h3 className="text-xs font-medium text-muted-foreground lg:text-sm">{label}</h3>
        </div>

        {/* Circular Gauge */}
        <div className="relative">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--color-muted))"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-2xl font-bold lg:text-3xl", getColor())}>
              {value}
              <span className="text-base lg:text-lg">{unit}</span>
            </span>
          </div>
        </div>

        {/* Target and Range Info */}
        <div className="mt-3 space-y-1 text-center text-xs lg:mt-4 lg:text-sm">
          <div className="flex items-center justify-center gap-2 lg:gap-4">
            <div>
              <span className="text-muted-foreground">Target: </span>
              <span className="font-medium">
                {target}
                {unit}
              </span>
            </div>
          </div>
          {min !== undefined && max !== undefined && (
            <div className="text-muted-foreground">
              Range: {min}
              {unit} - {max}
              {unit}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
