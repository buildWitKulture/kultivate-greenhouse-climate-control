import type { GreenhouseZone, WeatherData, TimeSeriesData, ControlSystem } from "./types"

// Generate mock time series data
export function generateTimeSeriesData(hours: number, baseValue: number, variance: number): TimeSeriesData[] {
  const data: TimeSeriesData[] = []
  const now = new Date()

  for (let i = hours * 60; i >= 0; i -= 5) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000)
    const randomVariance = (Math.random() - 0.5) * variance
    const value = baseValue + randomVariance
    data.push({ timestamp, value })
  }

  return data
}

// Mock greenhouse zones
export const mockGreenhouseZones: GreenhouseZone[] = [
  {
    id: "zone-1",
    name: "Greenhouse 1",
    status: "active",
    temperature: { current: 22, target: 24, min: 18, max: 28 },
    humidity: { current: 65, target: 70 },
    co2: { current: 800, target: 1000 },
    light: { current: 250, target: 300, unit: "μmol" },
    heating: { status: "on", percentage: 45 },
    ventilation: { status: "on", percentage: 30 },
    irrigation: { status: "off", lastRun: new Date(Date.now() - 3600000) },
    airCirculation: { status: "on", percentage: 50 },
    curtain: { status: "partial", percentage: 60 },
    lighting: { status: "on", intensity: 250 },
  },
  {
    id: "zone-2",
    name: "Greenhouse 2",
    status: "active",
    temperature: { current: 20, target: 22, min: 18, max: 26 },
    humidity: { current: 72, target: 70 },
    co2: { current: 950, target: 1000 },
    light: { current: 280, target: 300, unit: "μmol" },
    heating: { status: "on", percentage: 60 },
    ventilation: { status: "on", percentage: 25 },
    irrigation: { status: "off", lastRun: new Date(Date.now() - 7200000) },
    airCirculation: { status: "on", percentage: 45 },
    curtain: { status: "open", percentage: 100 },
    lighting: { status: "on", intensity: 280 },
  },
  {
    id: "zone-3",
    name: "Greenhouse 3",
    status: "active",
    temperature: { current: 14, target: 24, min: 14, max: 28 },
    humidity: { current: 81, target: 70 },
    co2: { current: 750, target: 1000 },
    light: { current: 300, target: 300, unit: "μmol" },
    heating: { status: "on", percentage: 100 },
    ventilation: { status: "off", percentage: 0 },
    irrigation: { status: "off", lastRun: new Date(Date.now() - 1800000) },
    airCirculation: { status: "off", percentage: 0 },
    curtain: { status: "closed", percentage: 0 },
    lighting: { status: "on", intensity: 300 },
  },
  {
    id: "zone-4",
    name: "Greenhouse 4",
    status: "warning",
    temperature: { current: 26, target: 24, min: 18, max: 28 },
    humidity: { current: 58, target: 70 },
    co2: { current: 1100, target: 1000 },
    light: { current: 320, target: 300, unit: "μmol" },
    heating: { status: "off", percentage: 0 },
    ventilation: { status: "on", percentage: 80 },
    irrigation: { status: "on", lastRun: new Date() },
    airCirculation: { status: "on", percentage: 70 },
    curtain: { status: "open", percentage: 100 },
    lighting: { status: "on", intensity: 320 },
  },
  {
    id: "zone-5",
    name: "Greenhouse 5",
    status: "active",
    temperature: { current: 23, target: 24, min: 18, max: 28 },
    humidity: { current: 68, target: 70 },
    co2: { current: 920, target: 1000 },
    light: { current: 290, target: 300, unit: "μmol" },
    heating: { status: "on", percentage: 35 },
    ventilation: { status: "on", percentage: 40 },
    irrigation: { status: "off", lastRun: new Date(Date.now() - 5400000) },
    airCirculation: { status: "on", percentage: 55 },
    curtain: { status: "partial", percentage: 70 },
    lighting: { status: "on", intensity: 290 },
  },
]

// Mock weather data
export const mockWeatherData: WeatherData[] = Array.from({ length: 288 }, (_, i) => {
  const now = new Date()
  const timestamp = new Date(now.getTime() - (287 - i) * 5 * 60 * 1000)

  return {
    timestamp,
    temperature: 18 + Math.sin(i / 48) * 8 + Math.random() * 2,
    humidity: 60 + Math.sin(i / 36) * 15 + Math.random() * 5,
    windSpeed: 5 + Math.random() * 10,
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
    rainStatus: Math.random() > 0.8 ? "light" : "none",
    solarRadiation: Math.max(0, 400 + Math.sin(i / 48) * 400 + Math.random() * 100),
  }
})

// Mock control systems
export const mockControlSystems: ControlSystem[] = [
  {
    id: "mist-1",
    name: "Mist Strategy",
    type: "mist",
    status: "off",
    mode: "Period 6",
  },
  {
    id: "irrigation-1",
    name: "Irrigation Valves",
    type: "irrigation",
    status: "manual",
    mode: "Overridden off",
  },
  {
    id: "heating-1",
    name: "Heating System",
    type: "heating",
    status: "auto",
    settings: { maxStages: 3, currentStage: 2 },
  },
  {
    id: "ventilation-1",
    name: "Ventilation",
    type: "ventilation",
    status: "auto",
    settings: { minSpeed: 20, maxSpeed: 100 },
  },
]

// Generate historical data for charts
export const generateHistoricalData = (zoneId: string) => {
  return {
    temperature: generateTimeSeriesData(12, 22, 4),
    humidity: generateTimeSeriesData(12, 68, 15),
    co2: generateTimeSeriesData(12, 900, 200),
    light: generateTimeSeriesData(12, 280, 50),
  }
}
