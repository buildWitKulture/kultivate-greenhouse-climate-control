"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Cloud, Settings, BarChart3, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockGreenhouseZones } from "@/lib/mock-data"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Weather", href: "/weather", icon: Cloud },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Manual Override", href: "/manual", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">AgriControl</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}

          {/* Zones Section */}
          <div className="pt-6">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Zones</h3>
            <div className="space-y-1">
              {mockGreenhouseZones.map((zone) => {
                const isActive = pathname === `/zone/${zone.id}`
                return (
                  <Link
                    key={zone.id}
                    href={`/zone/${zone.id}`}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span>{zone.name}</span>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        zone.status === "active" && "bg-primary",
                        zone.status === "warning" && "bg-warning",
                        zone.status === "offline" && "bg-destructive",
                      )}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">System Status</div>
            <div className="mt-1">All systems operational</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
