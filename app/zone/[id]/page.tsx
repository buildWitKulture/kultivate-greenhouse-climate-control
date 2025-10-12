import { AppLayout } from "@/components/layout/app-layout"
import { ZoneHeader } from "@/components/zone/zone-header"
import { EnvironmentalGauge } from "@/components/zone/environmental-gauge"
import { ControlCard } from "@/components/zone/control-card"
import { ClimateStrategy } from "@/components/zone/climate-strategy"
import { ZoneAnalytics } from "@/components/zone/zone-analytics"
import { mockGreenhouseZones, zonesCropTypes } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Thermometer, Droplets, Wind, Lightbulb, Flame, Fan, Droplet, Sun, Blinds, Sprout } from "lucide-react"

export default function ZoneDetailPage({ params }: { params: { id: string } }) {
  const zone = mockGreenhouseZones.find((z) => z.id === params.id)

  if (!zone) {
    notFound()
  }

  const cropType = zonesCropTypes[zone.id]

  // Determine status for each metric
  const tempStatus =
    Math.abs(zone.temperature.current - zone.temperature.target) > 3
      ? "critical"
      : Math.abs(zone.temperature.current - zone.temperature.target) > 2
        ? "warning"
        : "normal"

  const humidityStatus =
    Math.abs(zone.humidity.current - zone.humidity.target) > 15
      ? "critical"
      : Math.abs(zone.humidity.current - zone.humidity.target) > 10
        ? "warning"
        : "normal"

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
        {/* Zone Header */}
        <ZoneHeader zoneName={zone.name} zoneId={zone.id} status={zone.status} cropType={cropType} />

        {/* Environmental Gauges */}
        <div>
          <h2 className="mb-3 text-lg font-semibold lg:mb-4 lg:text-xl">Environmental Conditions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <EnvironmentalGauge
              label="Temperature"
              value={zone.temperature.current}
              target={zone.temperature.target}
              min={zone.temperature.min}
              max={zone.temperature.max}
              unit="°C"
              icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
              status={tempStatus}
            />
            <EnvironmentalGauge
              label="Humidity"
              value={zone.humidity.current}
              target={zone.humidity.target}
              min={40}
              max={90}
              unit="%"
              icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
              status={humidityStatus}
            />
            <EnvironmentalGauge
              label="Heating"
              value={zone.heating.percentage}
              target={100}
              min={0}
              max={100}
              unit="%"
              icon={<Flame className="h-4 w-4 text-muted-foreground" />}
              status="normal"
            />
            <EnvironmentalGauge
              label="Light Intensity"
              value={zone.light.current}
              target={zone.light.target}
              min={0}
              max={500}
              unit={zone.light.unit}
              icon={<Sun className="h-4 w-4 text-muted-foreground" />}
              status="normal"
            />
          </div>
        </div>

        {/* Climate Strategy */}
        <ClimateStrategy />

        {/* Zone Analytics */}
        <ZoneAnalytics zoneId={zone.id} />

        {/* Control Systems */}
        <div>
          <h2 className="mb-3 text-lg font-semibold lg:mb-4 lg:text-xl">Control Systems</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <ControlCard
              title="Ventilation"
              icon={<Wind className="h-5 w-5" />}
              status={zone.ventilation.status}
              value={zone.ventilation.percentage}
              unit="%"
              description="Air exchange rate"
              showSlider
            />
            <ControlCard
              title="Air Circulation"
              icon={<Fan className="h-5 w-5" />}
              status={zone.airCirculation.status}
              value={zone.airCirculation.percentage}
              unit="%"
              description="Internal air movement"
              showSlider
            />
            <ControlCard
              title="Irrigation"
              icon={<Droplet className="h-5 w-5" />}
              status={zone.irrigation.status}
              description={`Last run: ${new Date(zone.irrigation.lastRun).toLocaleTimeString()}`}
            />
            <ControlCard
              title="Heating System"
              icon={<Flame className="h-5 w-5" />}
              status={zone.heating.status}
              value={zone.heating.percentage}
              unit="%"
              description="Temperature control"
              showSlider
            />
            <ControlCard
              title="Lighting"
              icon={<Lightbulb className="h-5 w-5" />}
              status={zone.lighting.status}
              value={zone.lighting.intensity}
              unit={zone.light.unit}
              description="Supplemental lighting"
              showSlider
            />
            <ControlCard
              title="Curtain System"
              icon={<Blinds className="h-5 w-5" />}
              status={zone.curtain.status === "open" ? "on" : "off"}
              value={zone.curtain.percentage}
              unit="%"
              description="Light and heat control"
              showSlider
            />
            <ControlCard
              title="CO₂ Dosing"
              icon={<Sprout className="h-5 w-5" />}
              status="auto"
              value={zone.co2.current}
              unit="ppm"
              description={`Target: ${zone.co2.target} ppm`}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
