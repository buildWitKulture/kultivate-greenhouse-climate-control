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
