"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"

export function ClimateStrategy() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Leaf className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Climate Strategy</h3>
        <Badge className="ml-auto border-accent/20 bg-accent/10 text-accent" variant="outline">
          AI Optimized
        </Badge>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Strategy Type</p>
              <p className="font-medium">Balanced Growth</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Period</p>
              <p className="font-medium">Vegetative Phase</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Day/Night Cycle</p>
              <p className="font-medium">16h Day / 8h Night</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Optimization Goal</p>
              <p className="font-medium">Maximum Yield</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              AI-generated environmental conditions are actively maintaining optimal growth parameters based on crop
              type, growth stage, and external weather conditions.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <p className="text-sm text-muted-foreground">Schedule configuration coming soon...</p>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <p className="text-sm text-muted-foreground">Historical data coming soon...</p>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
