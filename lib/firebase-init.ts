import { ref, set } from "firebase/database"
import { database } from "./firebase"
import type { GreenhouseData } from "./types"

export async function initializeFirebaseData() {
  try {
    const greenhouseData: Record<string, GreenhouseData> = {
      "greenhouse-1": {
        id: "greenhouse-1",
        name: "Greenhouse 1",
        mode: "normal",
        sensors: {
          temperature: 24,
          humidity: 65,
          soilMoisture: 50,
          gasLevel: 400,
          lastUpdate: Date.now(),
        },
        normalMode: {
          enabled: true,
          parameters: {
            targetTempMin: 20,
            targetTempMax: 30,
            targetHumidityMin: 50,
            targetHumidityMax: 70,
            targetSoilMoistureMin: 40,
            targetSoilMoistureMax: 60,
          },
          actuatorStates: {
            fan: false,
            pump: false,
            heater: false,
            misting: false,
            lighting: false,
            co2dosing: false,
          },
        },
        simulation: {
          active: false,
          type: "none",
          startTime: 0,
          duration: 10,
          status: "idle",
          conditions: {
            temperature: 0,
            humidity: 0,
            soilMoisture: 0,
            gasLevel: 0,
          },
          actuatorStates: {
            fan: false,
            pump: false,
            heater: false,
            misting: false,
            lighting: false,
            co2dosing: false,
          },
        },
        logs: {
          simulationLogs: [],
        },
      },
    }

    await set(ref(database, "greenhouses"), greenhouseData)
    console.log("[v0] Firebase initialized successfully with simplified data")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error initializing Firebase:", error)
    return { success: false, error }
  }
}
