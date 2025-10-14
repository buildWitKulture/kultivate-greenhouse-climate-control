// lib/simulation-scenarios.ts
import { GreenhouseData } from "./firebase-config";

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  conditions: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    gasLevel: number;
  };
  expectedActuators: {
    fan: boolean;
    pump: boolean;
    heater: boolean;
    misting: boolean;
    lighting: boolean;
    co2dosing: boolean;
  };
  reasoning: string[];
}

export const simulationScenarios: Record<string, SimulationScenario> = {
  heatwave: {
    id: "heatwave",
    name: "Heatwave",
    description: "Extreme high temperature with low humidity",
    icon: "🔥",
    color: "#ef4444",
    conditions: {
      temperature: 38,
      humidity: 35,
      soilMoisture: 25,
      gasLevel: 400,
    },
    expectedActuators: {
      fan: true,
      pump: false,
      heater: false,
      misting: true,
      lighting: false,
      co2dosing: false,
    },
    reasoning: [
      "Temperature exceeds optimal range by 8°C",
      "Ventilation fans will activate to cool greenhouse",
      "Misting system will increase humidity and cool air",
      "Irrigation may activate if soil moisture drops below 30%",
    ],
  },

  drought: {
    id: "drought",
    name: "Drought",
    description: "Very low soil moisture with high temperature",
    icon: "🏜️",
    color: "#f59e0b",
    conditions: {
      temperature: 32,
      humidity: 40,
      soilMoisture: 15,
      gasLevel: 400,
    },
    expectedActuators: {
      fan: true,
      pump: true,
      heater: false,
      misting: false,
      lighting: false,
      co2dosing: false,
    },
    reasoning: [
      "Critical soil moisture level detected (15%)",
      "Temperature 2°C above optimal, requiring ventilation",
      "Irrigation system will activate immediately",
      "Continuous monitoring to prevent plant stress",
    ],
  },

  drysoil: {
    id: "drysoil",
    name: "Dry Soil",
    description: "Low soil moisture requiring irrigation",
    icon: "💧",
    color: "#0ea5e9",
    conditions: {
      temperature: 25,
      humidity: 60,
      soilMoisture: 20,
      gasLevel: 400,
    },
    expectedActuators: {
      fan: false,
      pump: true,
      heater: false,
      misting: false,
      lighting: false,
      co2dosing: false,
    },
    reasoning: [
      "Soil moisture below optimal threshold (20%)",
      "Temperature and humidity within acceptable range",
      "Irrigation system will activate to restore moisture",
      "Other systems remain in normal operation",
    ],
  },

  coldsnap: {
    id: "coldsnap",
    name: "Cold Snap",
    description: "Sudden temperature drop requiring heating",
    icon: "❄️",
    color: "#3b82f6",
    conditions: {
      temperature: 12,
      humidity: 75,
      soilMoisture: 50,
      gasLevel: 400,
    },
    expectedActuators: {
      fan: false,
      pump: false,
      heater: true,
      misting: false,
      lighting: false,
      co2dosing: false,
    },
    reasoning: [
      "Temperature 18°C below optimal range",
      "Heating system will activate to warm greenhouse",
      "Ventilation disabled to retain heat",
      "Risk of plant damage if temperature continues to drop",
    ],
  },

  highhumidity: {
    id: "highhumidity",
    name: "High Humidity",
    description: "Excessive moisture in the air",
    icon: "💦",
    color: "#6366f1",
    conditions: {
      temperature: 28,
      humidity: 90,
      soilMoisture: 55,
      gasLevel: 400,
    },
    expectedActuators: {
      fan: true,
      pump: false,
      heater: false,
      misting: false,
      lighting: false,
      co2dosing: false,
    },
    reasoning: [
      "Humidity exceeds optimal range (90%)",
      "Risk of fungal diseases and mold growth",
      "Ventilation fans will activate for dehumidification",
      "Air circulation increases to prevent condensation",
    ],
  },

  lowlight: {
    id: "lowlight",
    name: "Low Light",
    description: "Insufficient light for photosynthesis",
    icon: "🌑",
    color: "#8b5cf6",
    conditions: {
      temperature: 24,
      humidity: 65,
      soilMoisture: 45,
      gasLevel: 400,
    },
    expectedActuators: {
      fan: false,
      pump: false,
      heater: false,
      misting: false,
      lighting: true,
      co2dosing: false,
    },
    reasoning: [
      "Light intensity below photosynthesis threshold",
      "Supplemental lighting will activate",
      "Optimal for cloudy days or short winter periods",
      "Supports continuous plant growth and development",
    ],
  },

  co2deficiency: {
    id: "co2deficiency",
    name: "CO₂ Deficiency",
    description: "Low CO₂ levels affecting growth",
    icon: "🌱",
    color: "#10b981",
    conditions: {
      temperature: 26,
      humidity: 70,
      soilMoisture: 50,
      gasLevel: 300,
    },
    expectedActuators: {
      fan: false,
      pump: false,
      heater: false,
      misting: false,
      lighting: false,
      co2dosing: true,
    },
    reasoning: [
      "CO₂ level below optimal (300 ppm)",
      "CO₂ dosing system will activate",
      "Enhanced photosynthesis and growth rate",
      "Monitoring to maintain 400-600 ppm range",
    ],
  },
};

// Get scenario by ID
export const getScenarioById = (id: string): SimulationScenario | null => {
  return simulationScenarios[id] || null;
};

// Get all scenarios as array
export const getAllScenarios = (): SimulationScenario[] => {
  return Object.values(simulationScenarios);
};

// Determine actuator responses based on conditions
export const calculateActuatorResponse = (
  temperature: number,
  humidity: number,
  soilMoisture: number,
  gasLevel: number,
  optimalTemp: number = 25,
  optimalHumidity: number = 65,
  optimalSoilMoisture: number = 50,
  optimalGasLevel: number = 400
): GreenhouseData["actuators"] => {
  const response: GreenhouseData["actuators"] = {
    fan: false,
    pump: false,
    heater: false,
    misting: false,
    lighting: false,
    co2dosing: false,
  };

  // Temperature control
  if (temperature > optimalTemp + 5) {
    response.fan = true;
    response.misting = true;
  } else if (temperature < optimalTemp - 5) {
    response.heater = true;
  }

  // Soil moisture control
  if (soilMoisture < 30) {
    response.pump = true;
  }

  // Humidity control
  if (humidity > 85) {
    response.fan = true;
  } else if (humidity < 50) {
    response.misting = true;
  }

  // CO2 control
  if (gasLevel < 350) {
    response.co2dosing = true;
  }

  return response;
};
