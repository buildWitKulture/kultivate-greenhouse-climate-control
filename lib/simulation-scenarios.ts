import type { SimulationScenario, ActuatorStates } from "./types"

export const simulationScenarios: Record<string, SimulationScenario> = {
  heatwave: {
    id: "heatwave",
    name: "Heatwave",
    description: "Extreme high temperature with low humidity",
    icon: "🔥",
    conditions: {
      temperature: 45,
      humidity: 30,
      soilMoisture: 40,
      gasLevel: 400,
    },
    expectedActuators: ["fan", "misting"],
  },
  drought: {
    id: "drought",
    name: "Drought",
    description: "Very low soil moisture with high temperature",
    icon: "🏜️",
    conditions: {
      temperature: 35,
      humidity: 25,
      soilMoisture: 10,
      gasLevel: 380,
    },
    expectedActuators: ["fan", "pump"],
  },
  drysoil: {
    id: "drysoil",
    name: "Dry Soil",
    description: "Low soil moisture requiring irrigation",
    icon: "💧",
    conditions: {
      temperature: 28,
      humidity: 45,
      soilMoisture: 15,
      gasLevel: 400,
    },
    expectedActuators: ["pump"],
  },
  coldsnap: {
    id: "coldsnap",
    name: "Cold Snap",
    description: "Sudden temperature drop requiring heating",
    icon: "❄️",
    conditions: {
      temperature: 10,
      humidity: 70,
      soilMoisture: 60,
      gasLevel: 400,
    },
    expectedActuators: ["heater"],
  },
  highhumidity: {
    id: "highhumidity",
    name: "High Humidity",
    description: "Excessive moisture in the air",
    icon: "💦",
    conditions: {
      temperature: 25,
      humidity: 90,
      soilMoisture: 55,
      gasLevel: 400,
    },
    expectedActuators: ["fan"],
  },
  lowlight: {
    id: "lowlight",
    name: "Low Light",
    description: "Insufficient light for photosynthesis",
    icon: "🌑",
    conditions: {
      temperature: 22,
      humidity: 60,
      soilMoisture: 50,
      gasLevel: 400,
    },
    expectedActuators: ["lighting"],
  },
  co2deficiency: {
    id: "co2deficiency",
    name: "CO₂ Deficiency",
    description: "Low CO₂ levels affecting growth",
    icon: "🌱",
    conditions: {
      temperature: 24,
      humidity: 55,
      soilMoisture: 50,
      gasLevel: 200,
    },
    expectedActuators: ["co2dosing"],
  },
}

export const getAllScenarios = (): SimulationScenario[] => {
  return Object.values(simulationScenarios)
}

export const getScenarioById = (id: string): SimulationScenario | null => {
  return simulationScenarios[id] || null
}

export const calculateActuatorResponse = (
  temperature: number,
  humidity: number,
  soilMoisture: number,
  gasLevel: number,
  optimalTemp = 25,
  optimalHumidity = 65,
  optimalSoilMoisture = 50,
  optimalGasLevel = 400,
): ActuatorStates => {
  const response: ActuatorStates = {
    fan: false,
    pump: false,
    heater: false,
    misting: false,
    lighting: false,
    co2dosing: false,
  }

  // Temperature control
  if (temperature > optimalTemp + 5) {
    response.fan = true
    response.misting = true
  } else if (temperature < optimalTemp - 5) {
    response.heater = true
  }

  // Soil moisture control
  if (soilMoisture < 30) {
    response.pump = true
  }

  // Humidity control
  if (humidity > 85) {
    response.fan = true
  } else if (humidity < 50) {
    response.misting = true
  }

  // CO2 control
  if (gasLevel < 350) {
    response.co2dosing = true
  }

  return response
}
