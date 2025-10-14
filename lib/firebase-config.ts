// lib/firebase-config.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update, get } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// Database structure for each greenhouse zone
export interface GreenhouseData {
  sensors: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    gasLevel: number;
    lastUpdate: number;
  };
  simulation: {
    active: boolean;
    type:
      | "none"
      | "heatwave"
      | "drysoil"
      | "drought"
      | "coldsnap"
      | "highhumidity"
      | "lowlight"
      | "co2deficiency";
    startTime: number;
    duration: number; // milliseconds (default 10000)
    status: "idle" | "running" | "complete";
  };
  actuators: {
    fan: boolean;
    pump: boolean;
    heater: boolean;
    misting: boolean;
    lighting: boolean;
    co2dosing: boolean;
  };
  logs: {
    simulationLogs: SimulationLog[];
  };
}

export interface SimulationLog {
  id: string;
  timestamp: number;
  type: string;
  scenario: string;
  duration: number;
  startConditions: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    gasLevel: number;
  };
  endConditions: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    gasLevel: number;
  };
  actuatorActions: string[];
  status: "completed" | "aborted";
}

// Firebase helper functions
export const getGreenhouseRef = (zoneId: string) => {
  return ref(database, `greenhouses/${zoneId}`);
};

export const getSensorsRef = (zoneId: string) => {
  return ref(database, `greenhouses/${zoneId}/sensors`);
};

export const getSimulationRef = (zoneId: string) => {
  return ref(database, `greenhouses/${zoneId}/simulation`);
};

export const getActuatorsRef = (zoneId: string) => {
  return ref(database, `greenhouses/${zoneId}/actuators`);
};

export const getLogsRef = (zoneId: string) => {
  return ref(database, `greenhouses/${zoneId}/logs`);
};

// Initialize greenhouse data structure
export const initializeGreenhouse = async (zoneId: string) => {
  const greenhouseRef = getGreenhouseRef(zoneId);
  const initialData: GreenhouseData = {
    sensors: {
      temperature: 0,
      humidity: 0,
      soilMoisture: 0,
      gasLevel: 0,
      lastUpdate: Date.now(),
    },
    simulation: {
      active: false,
      type: "none",
      startTime: 0,
      duration: 10000,
      status: "idle",
    },
    actuators: {
      fan: false,
      pump: false,
      heater: false,
      misting: false,
      lighting: false,
      co2dosing: false,
    },
    logs: {
      simulationLogs: [],
    },
  };

  await set(greenhouseRef, initialData);
};

// Update sensor readings
export const updateSensorReadings = async (
  zoneId: string,
  readings: Partial<GreenhouseData["sensors"]>
) => {
  const sensorsRef = getSensorsRef(zoneId);
  await update(sensorsRef, {
    ...readings,
    lastUpdate: Date.now(),
  });
};

// Start simulation
export const startSimulation = async (
  zoneId: string,
  simulationType: GreenhouseData["simulation"]["type"]
) => {
  const simulationRef = getSimulationRef(zoneId);
  await update(simulationRef, {
    active: true,
    type: simulationType,
    startTime: Date.now(),
    duration: 10000,
    status: "running",
  });
};

// Stop simulation
export const stopSimulation = async (zoneId: string) => {
  const simulationRef = getSimulationRef(zoneId);
  await update(simulationRef, {
    active: false,
    type: "none",
    status: "complete",
  });
};

// Update actuator states
export const updateActuators = async (
  zoneId: string,
  actuators: Partial<GreenhouseData["actuators"]>
) => {
  const actuatorsRef = getActuatorsRef(zoneId);
  await update(actuatorsRef, actuators);
};

// Add simulation log
export const addSimulationLog = async (zoneId: string, log: SimulationLog) => {
  const logsRef = ref(database, `greenhouses/${zoneId}/logs/simulationLogs`);
  const snapshot = await get(logsRef);
  const currentLogs = snapshot.val() || [];

  await set(logsRef, [...currentLogs, log]);
};

// Subscribe to greenhouse data changes
export const subscribeToGreenhouse = (
  zoneId: string,
  callback: (data: GreenhouseData) => void
) => {
  const greenhouseRef = getGreenhouseRef(zoneId);
  return onValue(greenhouseRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

// Subscribe to simulation changes
export const subscribeToSimulation = (
  zoneId: string,
  callback: (simulation: GreenhouseData["simulation"]) => void
) => {
  const simulationRef = getSimulationRef(zoneId);
  return onValue(simulationRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};
