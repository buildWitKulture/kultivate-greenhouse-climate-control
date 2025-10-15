"use client"

import { useEffect, useState } from "react"
import { ref, onValue, update } from "firebase/database"
import { database } from "./firebase"
import type { GreenhouseData } from "./types"

export function useGreenhouses() {
  const [greenhouses, setGreenhouses] = useState<GreenhouseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const greenhousesRef = ref(database, "greenhouses")

    const unsubscribe = onValue(
      greenhousesRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            const greenhousesArray = Object.entries(data).map(([id, greenhouse]: [string, any]) => ({
              ...greenhouse,
              id,
            }))
            setGreenhouses(greenhousesArray)
          } else {
            setGreenhouses([])
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

  return { greenhouses, loading, error }
}

export function useGreenhouse(greenhouseId: string) {
  const [greenhouse, setGreenhouse] = useState<GreenhouseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!greenhouseId) {
      setLoading(false)
      return
    }

    const greenhouseRef = ref(database, `greenhouses/${greenhouseId}`)

    const unsubscribe = onValue(
      greenhouseRef,
      (snapshot) => {
        try {
          const data = snapshot.val()
          if (data) {
            setGreenhouse({
              ...data,
              id: greenhouseId,
            })
          } else {
            setGreenhouse(null)
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
  }, [greenhouseId])

  return { greenhouse, loading, error }
}

export async function updateGreenhouse(greenhouseId: string, updates: Partial<GreenhouseData>) {
  const greenhouseRef = ref(database, `greenhouses/${greenhouseId}`)
  await update(greenhouseRef, updates)
}

export async function startSimulation(greenhouseId: string, simulationType: string) {
  const greenhouseRef = ref(database, `greenhouses/${greenhouseId}`)

  const scenarios: Record<string, any> = {
    heatwave: { temperature: 45, humidity: 30, soilMoisture: 40, gasLevel: 400 },
    drysoil: { temperature: 28, humidity: 45, soilMoisture: 15, gasLevel: 400 },
    drought: { temperature: 35, humidity: 25, soilMoisture: 10, gasLevel: 380 },
    coldsnap: { temperature: 10, humidity: 70, soilMoisture: 60, gasLevel: 350 },
    highhumidity: { temperature: 25, humidity: 90, soilMoisture: 80, gasLevel: 400 },
    lowlight: { temperature: 22, humidity: 60, soilMoisture: 50, gasLevel: 300 },
    co2deficiency: { temperature: 24, humidity: 55, soilMoisture: 50, gasLevel: 200 },
  }

  const updates = {
    mode: "simulation",
    "simulation/active": true,
    "simulation/type": simulationType,
    "simulation/startTime": Date.now(),
    "simulation/duration": 10,
    "simulation/status": "running",
    "simulation/conditions": scenarios[simulationType] || scenarios.heatwave,
  }

  await update(greenhouseRef, updates)
}

export async function stopSimulation(greenhouseId: string) {
  const greenhouseRef = ref(database, `greenhouses/${greenhouseId}`)

  const updates = {
    mode: "normal",
    "simulation/active": false,
    "simulation/status": "complete",
  }

  await update(greenhouseRef, updates)
}

export function useHistoricalData(greenhouseId: string) {
  const [data, setData] = useState<{
    temperature: Array<{ timestamp: Date; value: number }>
    humidity: Array<{ timestamp: Date; value: number }>
    co2: Array<{ timestamp: Date; value: number }>
    light: Array<{ timestamp: Date; value: number }>
  }>({
    temperature: [],
    humidity: [],
    co2: [],
    light: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!greenhouseId) {
      setLoading(false)
      return
    }

    const historicalRef = ref(database, `historical/${greenhouseId}`)

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
  }, [greenhouseId])

  return { data, loading, error }
}
