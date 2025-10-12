import { mockGreenhouseZones } from "@/lib/mock-data"
import { EfficiencySimulator } from "@/components/simulation/efficiency-simulator"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EfficiencyPage({ params }: { params: { id: string } }) {
  const zone = mockGreenhouseZones.find((z) => z.id === params.id)

  if (!zone) {
    notFound()
  }

  // Map zone names to crop types
  const cropTypeMap: Record<string, string> = {
    "Greenhouse 1": "pepper",
    "Greenhouse 2": "tomato",
    "Greenhouse 3": "cucumber",
    "Greenhouse 4": "lettuce",
    "Greenhouse 5": "pepper",
  }

  const cropType = cropTypeMap[zone.name] || "pepper"

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link href={`/zone/${zone.id}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to {zone.name}
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">Efficiency Simulation</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Test control system efficiency for {zone.name}</p>
        </div>
      </div>

      <EfficiencySimulator zone={zone} cropType={cropType} />
    </div>
  )
}
