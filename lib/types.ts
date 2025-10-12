// Core types for the greenhouse monitoring system
export interface GreenhouseZone {
  id: string
  name: string
  status: "active" | "warning" | "offline"
  temperature: {
    current: number
    target: number
    min: number
    max: number
  }
  humidity: {
    current: number
    target: number
  }
  co2: {
    current: number
    target: number
  }
  light: {
    current: number
    target: number
    unit: "μmol"
  }
  soilMoisture?: {
    current: number
    target: number
    min: number
    max: number
  }
  heating: {
    status: "on" | "off"
    percentage: number
  }
  ventilation: {
    status: "on" | "off"
    percentage: number
  }
  irrigation: {
    status: "on" | "off" | "manual"
    lastRun: Date
  }
  airCirculation: {
    status: "on" | "off"
    percentage: number
  }
  curtain: {
    status: "open" | "closed" | "partial"
    percentage: number
  }
  lighting: {
    status: "on" | "off"
    intensity: number
  }
}

export interface WeatherData {
  timestamp: Date
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  rainStatus: "none" | "light" | "moderate" | "heavy"
  solarRadiation: number
}

export interface TimeSeriesData {
  timestamp: Date
  value: number
}

export interface ControlSystem {
  id: string
  name: string
  type: "mist" | "irrigation" | "heating" | "ventilation" | "lighting" | "co2"
  status: "on" | "off" | "auto" | "manual"
  mode?: string
  settings?: Record<string, any>
}

export interface SimulationMode {
  enabled: boolean
  scenario: "normal" | "heatwave" | "cold" | "humid" | "dry" | "custom"
  customSettings?: Partial<GreenhouseZone>
}

export interface CropOptimalConditions {
  cropType: string
  temperature: { min: number; optimal: number; max: number }
  humidity: { min: number; optimal: number; max: number }
  co2: { min: number; optimal: number; max: number }
  light: { min: number; optimal: number; max: number }
}

export interface EfficiencySimulation {
  zoneId: string
  currentConditions: Partial<GreenhouseZone>
  optimalConditions: CropOptimalConditions
  controlSystemResponse: ControlSystemResponse[]
  estimatedRecoveryTime: number // in minutes
  efficiencyScore: number // 0-100
}

export interface ControlSystemResponse {
  system: string
  action: string
  intensity: number // 0-100
  estimatedImpact: string
  timeToEffect: number // in minutes
}

export interface SimulationScenario {
  id: string
  name: string
  description: string
  icon: string
  conditions: {
    temperature?: number
    humidity?: number
    co2?: number
    light?: number
    soilMoisture?: number
  }
  expectedActuators: string[]
}

export interface SimulationRun {
  id: string
  zoneId: string
  scenarioId: string
  startTime: Date
  endTime?: Date
  duration: number // in seconds
  status: "pending" | "running" | "completed" | "cancelled"
  initialConditions: Partial<GreenhouseZone>
  targetConditions: Partial<GreenhouseZone>
  actuatorResponses: ActuatorResponse[]
  notifications: SimulationNotification[]
}

export interface ActuatorResponse {
  actuator: string
  action: string
  trigger: string
  activatedAt: number // seconds since simulation start
  intensity: number
  status: "pending" | "active" | "completed"
}

export interface SimulationNotification {
  id: string
  type: "info" | "warning" | "success" | "error"
  message: string
  timestamp: Date
  read: boolean
}
