"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw, Settings, Activity, Play } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ZoneHeaderProps {
  zoneName: string
  zoneId: string
  status: "active" | "warning" | "offline"
  cropType?: string
}

export function ZoneHeader({ zoneName, zoneId, status, cropType }: ZoneHeaderProps) {
  const statusColors = {
    active: "border-primary/20 bg-primary/10 text-primary",
    warning: "border-warning/20 bg-warning/10 text-warning",
    offline: "border-destructive/20 bg-destructive/10 text-destructive",
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">{zoneName}</h1>
            <Badge className={cn("border", statusColors[status])} variant="outline">
              {status}
            </Badge>
            {cropType && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                {cropType}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Zone ID: {zoneId}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/zone/${zoneId}/simulate`}>
          <Button variant="default" size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Climate Simulation</span>
            <span className="sm:hidden">Simulate</span>
          </Button>
        </Link>
        <Link href={`/zone/${zoneId}/efficiency`}>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Efficiency Test</span>
            <span className="sm:hidden">Efficiency</span>
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Configure</span>
        </Button>
      </div>
    </div>
  )
}
