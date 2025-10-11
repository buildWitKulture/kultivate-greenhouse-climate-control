"use client"

import { create } from "zustand"
import type { GreenhouseZone, SimulationMode } from "./types"

interface SimulationState {
  isSimulating: boolean
  simulationMode: SimulationMode
  modifiedZones: Map<string, Partial<GreenhouseZone>>
  startSimulation: (scenario: SimulationMode["scenario"]) => void
  stopSimulation: () => void
  updateZoneParameter: (zoneId: string, parameter: keyof GreenhouseZone, value: any) => void
  resetZone: (zoneId: string) => void
  resetAll: () => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isSimulating: false,
  simulationMode: {
    enabled: false,
    scenario: "normal",
  },
  modifiedZones: new Map(),

  startSimulation: (scenario) => {
    set({
      isSimulating: true,
      simulationMode: {
        enabled: true,
        scenario,
      },
    })
  },

  stopSimulation: () => {
    set({
      isSimulating: false,
      simulationMode: {
        enabled: false,
        scenario: "normal",
      },
      modifiedZones: new Map(),
    })
  },

  updateZoneParameter: (zoneId, parameter, value) => {
    set((state) => {
      const newModifiedZones = new Map(state.modifiedZones)
      const currentZone = newModifiedZones.get(zoneId) || {}
      newModifiedZones.set(zoneId, {
        ...currentZone,
        [parameter]: value,
      })
      return { modifiedZones: newModifiedZones }
    })
  },

  resetZone: (zoneId) => {
    set((state) => {
      const newModifiedZones = new Map(state.modifiedZones)
      newModifiedZones.delete(zoneId)
      return { modifiedZones: newModifiedZones }
    })
  },

  resetAll: () => {
    set({
      modifiedZones: new Map(),
    })
  },
}))
