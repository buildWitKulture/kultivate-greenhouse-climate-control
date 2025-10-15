import { ref, set } from "firebase/database"
import { database } from "./firebase"
import { mockGreenhouseZones, mockWeatherData, zonesCropTypes, generateHistoricalData } from "./mock-data"

// Initialize Firebase with mock data (run this once to seed the database)
export async function initializeFirebaseData() {
  try {
    // Initialize zones
    const zonesData: Record<string, any> = {}
    mockGreenhouseZones.forEach((zone) => {
      zonesData[zone.id] = {
        ...zone,
        irrigation: {
          ...zone.irrigation,
          lastRun: zone.irrigation.lastRun.toISOString(),
        },
      }
    })
    await set(ref(database, "zones"), zonesData)

    // Initialize weather data
    const weatherData: Record<string, any> = {}
    mockWeatherData.forEach((weather, index) => {
      weatherData[`weather-${index}`] = {
        ...weather,
        timestamp: weather.timestamp.toISOString(),
      }
    })
    await set(ref(database, "weather"), weatherData)

    // Initialize crop types
    await set(ref(database, "cropTypes"), zonesCropTypes)

    // Initialize historical data for each zone
    for (const zone of mockGreenhouseZones) {
      const historicalData = generateHistoricalData(zone.id)
      const historicalFormatted = {
        temperature: historicalData.temperature.map((item, index) => ({
          timestamp: item.timestamp.toISOString(),
          value: item.value,
        })),
        humidity: historicalData.humidity.map((item, index) => ({
          timestamp: item.timestamp.toISOString(),
          value: item.value,
        })),
        co2: historicalData.co2.map((item, index) => ({
          timestamp: item.timestamp.toISOString(),
          value: item.value,
        })),
        light: historicalData.light.map((item, index) => ({
          timestamp: item.timestamp.toISOString(),
          value: item.value,
        })),
      }
      await set(ref(database, `historical/${zone.id}`), historicalFormatted)
    }

    console.log("[v0] Firebase initialized successfully with mock data")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error initializing Firebase:", error)
    return { success: false, error }
  }
}
