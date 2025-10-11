"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RefreshCw, Settings } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
          <Play className="h-4 w-4" />
          Start Simulation
        </Button>
        <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
          <Pause className="h-4 w-4" />
          Pause All Systems
        </Button>
        <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Sync Data
        </Button>
        <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
          <Settings className="h-4 w-4" />
          System Settings
        </Button>
      </div>
    </Card>
  )
}
