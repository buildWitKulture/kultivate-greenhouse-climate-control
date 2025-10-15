export type SystemMode = "normal" | "simulation"

export type SimulationType =
  | "none"
  | "heatwave"
  | "drysoil"
  | "drought"
  | "coldsnap"
  | "highhumidity"
  | "lowlight"
  | "co2deficiency"

export interface SensorData {
  temperature: number
  humidity: number
  soilMoisture: number
  gasLevel: number
  lastUpdate: number
}

export interface ActuatorStates {
  fan: boolean
  pump: boolean
  heater: boolean
  misting: boolean
  lighting: boolean
  co2dosing: boolean
}

export interface NormalModeConfig {
  enabled: boolean
  parameters: {
    targetTempMin: number
    targetTempMax: number
    targetHumidityMin: number
    targetHumidityMax: number
    targetSoilMoistureMin: number
    targetSoilMoistureMax: number
  }
  actuatorStates: ActuatorStates
}

export interface SimulationConfig {
  active: boolean
  type: SimulationType
  startTime: number
  duration: number
  status: "idle" | "running" | "complete"
  conditions: {
    temperature: number
    humidity: number
    soilMoisture: number
    gasLevel: number
  }
  actuatorStates: ActuatorStates
}

export interface SimulationLog {
  id: string
  timestamp: number
  type: SimulationType
  duration: number
  status: "complete" | "cancelled"
  initialConditions: SensorData
  finalConditions: SensorData
}

export interface GreenhouseData {
  id: string
  name: string
  mode: SystemMode
  sensors: SensorData
  normalMode: NormalModeConfig
  simulation: SimulationConfig
  logs: {
    simulationLogs: SimulationLog[]
  }
}

export interface SimulationScenario {
  id: SimulationType
  name: string
  description: string
  icon: string
  conditions: {
    temperature: number
    humidity: number
    soilMoisture: number
    gasLevel: number
  }
  expectedActuators: string[]
}
