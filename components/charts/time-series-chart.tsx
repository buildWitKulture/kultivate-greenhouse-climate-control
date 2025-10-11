"use client"

import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts"
import type { TimeSeriesData } from "@/lib/types"

interface TimeSeriesChartProps {
  title: string
  data: Array<{
    name: string
    data: TimeSeriesData[]
    color: string
  }>
  yAxisLabel?: string
  height?: number
}

export function TimeSeriesChart({ title, data, yAxisLabel, height = 300 }: TimeSeriesChartProps) {
  // Transform data for Recharts
  const chartData = data[0].data.map((point, index) => {
    const dataPoint: any = {
      time: point.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    data.forEach((series) => {
      dataPoint[series.name] = series.data[index]?.value || 0
    })

    return dataPoint
  })

  return (
    <Card className="p-4 lg:p-6">
      <h3 className="mb-3 text-base font-semibold lg:mb-4 lg:text-lg">{title}</h3>
      <ResponsiveContainer width="100%" height={height} className="text-xs lg:text-sm">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--color-muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="hsl(var(--color-muted-foreground))"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "hsl(var(--color-muted-foreground))", fontSize: 10 },
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--color-card))",
              border: "1px solid hsl(var(--color-border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--color-foreground))" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {data.map((series) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              stroke={series.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
