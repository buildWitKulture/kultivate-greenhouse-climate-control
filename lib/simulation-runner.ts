import type {
  GreenhouseZone,
  SimulationScenario,
  SimulationRun,
  ActuatorResponse,
  SimulationNotification,
} from "./types"
import { cropOptimalConditions } from "./crop-conditions"

export function createSimulationRun(
  zone: GreenhouseZone,
  scenario: SimulationScenario,
  cropType: string,
): SimulationRun {
  const optimalConditions = cropOptimalConditions[cropType.toLowerCase()]
  const actuatorResponses: ActuatorResponse[] = []

  // Determine which actuators should respond based on scenario conditions
  const tempDiff = (scenario.conditions.temperature || zone.temperature.current) - optimalConditions.temperature.optimal
  const humidityDiff = (scenario.conditions.humidity || zone.humidity.current) - optimalConditions.humidity.optimal
  const soilMoistureDiff = (scenario.conditions.soilMoisture || zone.soilMoisture?.current || 50) - 50

  // Temperature responses
  if (tempDiff > 5) {
    // Too hot
    actuatorResponses.push({
      actuator: "Ventilation",
      action: "Increase to 80%",
      trigger: `Temperature ${tempDiff.toFixed(1)}°C above optimal`,
      activatedAt: 1,
      intensity: 80,
      status: "pending",
    })
    actuatorResponses.push({
      actuator: "Curtain",
      action: "Close to 60%",
      trigger: "Reduce solar heat gain",
      activatedAt: 1,
      intensity: 60,
      status: "pending",
    })
  } else if (tempDiff < -5) {
    // Too cold
    actuatorResponses.push({
      actuator: "Heating",
      action: "Increase to 70%",
      trigger: `Temperature ${Math.abs(tempDiff).toFixed(1)}°C below optimal`,
      activatedAt: 1,
      intensity: 70,
      status: "pending",
    })
    actuatorResponses.push({
      actuator: "Ventilation",
      action: "Reduce to 20%",
      trigger: "Retain heat",
      activatedAt: 1,
      intensity: 20,
      status: "pending",
    })
  }

  // Humidity responses
  if (humidityDiff > 15) {
    // Too humid
    actuatorResponses.push({
      actuator: "Ventilation",
      action: "Increase to 70%",
      trigger: `Humidity ${humidityDiff.toFixed(0)}% above optimal`,
      activatedAt: 2,
      intensity: 70,
      status: "pending",
    })
  } else if (humidityDiff < -15) {
    // Too dry
    actuatorResponses.push({
      actuator: "Misting",
      action: "Activate at 50%",
      trigger: `Humidity ${Math.abs(humidityDiff).toFixed(0)}% below optimal`,
      activatedAt: 2,
      intensity: 50,
      status: "pending",
    })
  }

  // Soil moisture and irrigation responses
  if (soilMoistureDiff < -20 || (tempDiff > 5 && soilMoistureDiff < -10)) {
    // Dry soil or hot + moderately dry
    actuatorResponses.push({
      actuator: "Irrigation",
      action: "Start watering cycle",
      trigger:
        tempDiff > 5
          ? "High temperature and low soil moisture detected"
          : `Soil moisture ${Math.abs(soilMoistureDiff).toFixed(0)}% below target`,
      activatedAt: 2,
      intensity: 100,
      status: "pending",
    })
  }

  // Light responses
  if (scenario.conditions.light && scenario.conditions.light < optimalConditions.light.optimal - 50) {
    actuatorResponses.push({
      actuator: "Lighting",
      action: "Increase to 80%",
      trigger: "Insufficient light for photosynthesis",
      activatedAt: 1,
      intensity: 80,
      status: "pending",
    })
  }

  // CO2 responses
  if (scenario.conditions.co2 && scenario.conditions.co2 < optimalConditions.co2.optimal - 100) {
    actuatorResponses.push({
      actuator: "CO2 Dosing",
      action: "Increase injection rate",
      trigger: "CO₂ levels below optimal",
      activatedAt: 3,
      intensity: 60,
      status: "pending",
    })
  }

  const notifications: SimulationNotification[] = [
    {
      id: `notif-${Date.now()}-1`,
      type: "info",
      message: `Simulation "${scenario.name}" initiated for ${zone.name}`,
      timestamp: new Date(),
      read: false,
    },
    {
      id: `notif-${Date.now()}-2`,
      type: "warning",
      message: `${actuatorResponses.length} actuator(s) will respond to simulated conditions`,
      timestamp: new Date(),
      read: false,
    },
  ]

  return {
    id: `sim-${Date.now()}`,
    zoneId: zone.id,
    scenarioId: scenario.id,
    startTime: new Date(),
    duration: 10, // 10 seconds
    status: "pending",
    initialConditions: {
      temperature: zone.temperature,
      humidity: zone.humidity,
      co2: zone.co2,
      light: zone.light,
      soilMoisture: zone.soilMoisture,
    },
    targetConditions: {
      temperature: { ...zone.temperature, current: scenario.conditions.temperature || zone.temperature.current },
      humidity: { ...zone.humidity, current: scenario.conditions.humidity || zone.humidity.current },
      co2: { ...zone.co2, current: scenario.conditions.co2 || zone.co2.current },
      light: { ...zone.light, current: scenario.conditions.light || zone.light.current },
      soilMoisture: zone.soilMoisture
        ? { ...zone.soilMoisture, current: scenario.conditions.soilMoisture || zone.soilMoisture.current }
        : undefined,
    },
    actuatorResponses,
    notifications,
  }
}

// Firebase-ready data structure for sending to ESP32
export interface FirebaseSimulationData {
  zoneId: string
  scenarioId: string
  timestamp: number
  duration: number
  conditions: {
    temperature?: number
    humidity?: number
    co2?: number
    light?: number
    soilMoisture?: number
  }
  actuators: {
    name: string
    action: string
    intensity: number
    activateAt: number
  }[]
}

export function prepareFirebaseData(simulationRun: SimulationRun): FirebaseSimulationData {
  return {
    zoneId: simulationRun.zoneId,
    scenarioId: simulationRun.scenarioId,
    timestamp: simulationRun.startTime.getTime(),
    duration: simulationRun.duration,
    conditions: {
      temperature: simulationRun.targetConditions.temperature?.current,
      humidity: simulationRun.targetConditions.humidity?.current,
      co2: simulationRun.targetConditions.co2?.current,
      light: simulationRun.targetConditions.light?.current,
      soilMoisture: simulationRun.targetConditions.soilMoisture?.current,
    },
    actuators: simulationRun.actuatorResponses.map((response) => ({
      name: response.actuator,
      action: response.action,
      intensity: response.intensity,
      activateAt: response.activatedAt,
    })),
  }
}
