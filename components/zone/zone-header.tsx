"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ZoneHeaderProps {
  zoneName: string
  zoneId: string
  status: "active" | "warning" | "offline"
}

export function ZoneHeader({ zoneName, zoneId, status }: ZoneHeaderProps) {
  const statusColors = {
    active: "border-primary/20 bg-primary/10 text-primary",
    warning: "border-warning/20 bg-warning/10 text-warning",
    offline: "border-destructive/20 bg-destructive/10 text-destructive",
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{zoneName}</h1>
            <Badge className={cn("border", statusColors[status])} variant="outline">
              {status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Zone ID: {zoneId}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configure
        </Button>
      </div>
    </div>
  )
}
