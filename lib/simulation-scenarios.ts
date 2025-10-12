import type { SimulationScenario } from "./types"

export const simulationScenarios: SimulationScenario[] = [
  {
    id: "heatwave",
    name: "Heatwave",
    description: "Extreme high temperature conditions with low humidity",
    icon: "sun",
    conditions: {
      temperature: 38,
      humidity: 35,
      soilMoisture: 25,
    },
    expectedActuators: ["Ventilation", "Irrigation", "Curtain", "Misting"],
  },
  {
    id: "drought",
    name: "Drought",
    description: "Very low soil moisture with high temperature",
    icon: "droplet-off",
    conditions: {
      temperature: 32,
      humidity: 40,
      soilMoisture: 15,
    },
    expectedActuators: ["Irrigation", "Misting"],
  },
  {
    id: "dry-soil",
    name: "Dry Soil",
    description: "Low soil moisture requiring irrigation",
    icon: "droplet",
    conditions: {
      temperature: 24,
      humidity: 55,
      soilMoisture: 20,
    },
    expectedActuators: ["Irrigation"],
  },
  {
    id: "cold-snap",
    name: "Cold Snap",
    description: "Sudden temperature drop requiring heating",
    icon: "snowflake",
    conditions: {
      temperature: 12,
      humidity: 70,
      soilMoisture: 60,
    },
    expectedActuators: ["Heating", "Ventilation"],
  },
  {
    id: "high-humidity",
    name: "High Humidity",
    description: "Excessive moisture in the air",
    icon: "cloud-rain",
    conditions: {
      temperature: 22,
      humidity: 90,
      soilMoisture: 70,
    },
    expectedActuators: ["Ventilation", "Heating"],
  },
  {
    id: "low-light",
    name: "Low Light",
    description: "Insufficient light for photosynthesis",
    icon: "lightbulb-off",
    conditions: {
      temperature: 22,
      humidity: 65,
      light: 50,
      soilMoisture: 50,
    },
    expectedActuators: ["Lighting"],
  },
  {
    id: "co2-deficiency",
    name: "CO₂ Deficiency",
    description: "Low CO₂ levels affecting plant growth",
    icon: "wind",
    conditions: {
      temperature: 24,
      humidity: 65,
      co2: 300,
      soilMoisture: 50,
    },
    expectedActuators: ["CO2 Dosing"],
  },
]
