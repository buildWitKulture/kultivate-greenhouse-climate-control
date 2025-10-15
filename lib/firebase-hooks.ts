"use client"

import { useEffect, useState } from "react"
import { ref, onValue, set, push, update, get } from "firebase/database"
import { database } from "./firebase"
import type { GreenhouseZone, WeatherData, TimeSeriesData, SimulationRun } from "./types"
import { initializeFirebaseData } from "./firebase-init"

let initializationPromise: Promise<any> | null = null

async function ensureDataInitialized() {
  if (initializationPromise) {
    return initializationPromise
  }

  const zonesRef = ref(database, "zones")
  const snapshot = await get(zonesRef)

  if (!snapshot.exists()) {
    console.log("[v0] Database is empty, initializing with mock data...")
    initializationPromise = initializeFirebaseData()
    await initializationPromise
    initializationPromise = null
  }
}

// Hook to get all greenhouse zones with real-time updates
export function useGreenhouseZones() {
  const [zones, setZones] = useState<GreenhouseZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    ensureDataInitialized().then(() => {
      const zonesRef = ref(database, "zones")

      const unsubscribe = onValue(
        zonesRef,
        (snapshot) => {
          try {
            const data = snapshot.val()
            if (data) {
              const zonesArray = Object.entries(data).map(([id, zone]: [string, any]) => ({
                ...zone,
                id,
                // Convert timestamp strings back to Date objects
                irrigation: {
                  ...zone.irrigation,
                  lastRun: new Date(zone.irrigation.lastRun),
                },
              }))
              setZones(zonesArray)
            } else {
              setZones([])
            }
            setLoading(false)
          } catch (err) {
            setError(err as Error)
            setLoading(false)
          }
        },
        (err) => {
          setError(err)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    })
  }, [])

  return { zones, loading, error }
}

// Hook to get a single zone by ID with real-time updates
export function useGreenhouseZone(zoneId: string) {
  const [zone, setZone] = useState<GreenhouseZone | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!zoneId) {
      setLoading(false)
      return
    }

    const zoneRef = ref(database, `zones/${zoneId}`)

    const unsubscribe = onValue(
      zoneRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            setZone({
              ...data,
              id: zoneId,
              irrigation: {
                ...data.irrigation,
                lastRun: new Date(data.irrigation.lastRun),
              },
            })
          } else {
            setZone(null)
          }
          setLoading(false)
        } catch (err) {
          setError(err as Error)
          setLoading(false)
        }
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [zoneId])

  return { zone, loading, error }
}

// Hook to get weather data with real-time updates
export function useWeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const weatherRef = ref(database, "weather")

    const unsubscribe = onValue(
      weatherRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            const weatherArray = Object.values(data).map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp),
            }))
            setWeatherData(weatherArray)
          } else {
            setWeatherData([])
          }
          setLoading(false)
        } catch (err) {
          setError(err as Error)
          setLoading(false)
        }
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return { weatherData, loading, error }
}

// Hook to get historical data for a zone
export function useHistoricalData(zoneId: string) {
  const [data, setData] = useState<{
    temperature: TimeSeriesData[]
    humidity: TimeSeriesData[]
    co2: TimeSeriesData[]
    light: TimeSeriesData[]
  }>({
    temperature: [],
    humidity: [],
    co2: [],
    light: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!zoneId) {
      setLoading(false)
      return
    }

    const historicalRef = ref(database, `historical/${zoneId}`)

    const unsubscribe = onValue(
      historicalRef,
      (snapshot) => {
        try {
          const rawData = snapshot.val()
          if (rawData) {
            const processedData = {
              temperature: Object.values(rawData.temperature || {}).map((item: any) => ({
                timestamp: new Date(item.timestamp),
                value: item.value,
              })),
              humidity: Object.values(rawData.humidity || {}).map((item: any) => ({
                timestamp: new Date(item.timestamp),
                value: item.value,
              })),
              co2: Object.values(rawData.co2 || {}).map((item: any) => ({
                timestamp: new Date(item.timestamp),
                value: item.value,
              })),
              light: Object.values(rawData.light || {}).map((item: any) => ({
                timestamp: new Date(item.timestamp),
                value: item.value,
              })),
            }
            setData(processedData)
          }
          setLoading(false)
        } catch (err) {
          setError(err as Error)
          setLoading(false)
        }
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [zoneId])

  return { data, loading, error }
}

// Hook to get crop types
export function useCropTypes() {
  const [cropTypes, setCropTypes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const cropTypesRef = ref(database, "cropTypes")

    const unsubscribe = onValue(
      cropTypesRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          setCropTypes(data || {})
          setLoading(false)
        } catch (err) {
          setError(err as Error)
          setLoading(false)
        }
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return { cropTypes, loading, error }
}

// Function to update zone data
export async function updateZone(zoneId: string, updates: Partial<GreenhouseZone>) {
  const zoneRef = ref(database, `zones/${zoneId}`)
  await update(zoneRef, updates)
}

// Function to start a simulation
export async function startSimulation(simulationRun: Omit<SimulationRun, "id">) {
  const simulationsRef = ref(database, "simulations")
  const newSimulationRef = push(simulationsRef)

  const simulationData = {
    ...simulationRun,
    startTime: simulationRun.startTime.toISOString(),
    endTime: simulationRun.endTime?.toISOString(),
    notifications: simulationRun.notifications.map((n) => ({
      ...n,
      timestamp: n.timestamp.toISOString(),
    })),
  }

  await set(newSimulationRef, simulationData)
  return newSimulationRef.key
}

// Function to update simulation status
export async function updateSimulation(simulationId: string, updates: Partial<SimulationRun>) {
  const simulationRef = ref(database, `simulations/${simulationId}`)

  const updateData: any = { ...updates }
  if (updates.startTime) {
    updateData.startTime = updates.startTime.toISOString()
  }
  if (updates.endTime) {
    updateData.endTime = updates.endTime.toISOString()
  }
  if (updates.notifications) {
    updateData.notifications = updates.notifications.map((n) => ({
      ...n,
      timestamp: n.timestamp.toISOString(),
    }))
  }

  await update(simulationRef, updateData)
}

// Hook to get active simulation for a zone
export function useActiveSimulation(zoneId: string) {
  const [simulation, setSimulation] = useState<SimulationRun | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!zoneId) {
      setLoading(false)
      return
    }

    const simulationsRef = ref(database, "simulations")

    const unsubscribe = onValue(
      simulationsRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            // Find active simulation for this zone
            const simulations = Object.entries(data).map(([id, sim]: [string, any]) => ({
              ...sim,
              id,
              startTime: new Date(sim.startTime),
              endTime: sim.endTime ? new Date(sim.endTime) : undefined,
              notifications:
                sim.notifications?.map((n: any) => ({
                  ...n,
                  timestamp: new Date(n.timestamp),
                })) || [],
            }))

            const activeSimulation = simulations.find(
              (sim: SimulationRun) => sim.zoneId === zoneId && sim.status === "running",
            )

            setSimulation(activeSimulation || null)
          } else {
            setSimulation(null)
          }
          setLoading(false)
        } catch (err) {
          setError(err as Error)
          setLoading(false)
        }
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [zoneId])

  return { simulation, loading, error }
}
