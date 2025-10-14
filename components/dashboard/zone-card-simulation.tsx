// components/dashboard/zone-card-simulation.tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Thermometer, Droplets, Sprout, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import {
  subscribeToGreenhouse,
  type GreenhouseData,
} from "@/lib/firebase-config";

interface ZoneCardSimulationProps {
  zoneId: string;
  zoneName: string;
  cropType: string;
}

export default function ZoneCardSimulation({
  zoneId,
  zoneName,
  cropType,
}: ZoneCardSimulationProps) {
  const router = useRouter();
  const [greenhouseData, setGreenhouseData] = useState<GreenhouseData | null>(
    null
  );
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToGreenhouse(zoneId, (data) => {
      setGreenhouseData(data);
      setIsSimulationActive(data.simulation.active);
    });

    return () => unsubscribe();
  }, [zoneId]);

  const handleSimulationClick = () => {
    router.push(`/zone/${zoneId}/simulate`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{zoneName}</CardTitle>
            <p className="text-sm text-muted-foreground">{cropType}</p>
          </div>
          {isSimulationActive && (
            <Badge variant="default" className="animate-pulse">
              Simulation Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Readings */}
        {greenhouseData && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span>{greenhouseData.sensors.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>{greenhouseData.sensors.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Sprout className="h-4 w-4 text-green-500" />
              <span>{greenhouseData.sensors.soilMoisture}%</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Wind className="h-4 w-4 text-purple-500" />
              <span>{greenhouseData.sensors.gasLevel} ppm</span>
            </div>
          </div>
        )}

        {/* Active Systems Indicator */}
        {greenhouseData &&
          Object.values(greenhouseData.actuators).some((v) => v) && (
            <div className="text-xs text-muted-foreground">
              Active:{" "}
              {Object.entries(greenhouseData.actuators)
                .filter(([_, active]) => active)
                .map(([name]) => name)
                .join(", ")}
            </div>
          )}

        {/* Simulation Button */}
        <Button
          onClick={handleSimulationClick}
          variant={isSimulationActive ? "default" : "outline"}
          className="w-full"
          size="sm"
        >
          <Zap className="mr-2 h-4 w-4" />
          {isSimulationActive ? "View Simulation" : "Climate Simulation"}
        </Button>
      </CardContent>
    </Card>
  );
}
