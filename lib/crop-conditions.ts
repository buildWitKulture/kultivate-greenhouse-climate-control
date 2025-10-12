import type { CropOptimalConditions } from "./types"

// Optimal conditions for different crop types
export const cropOptimalConditions: Record<string, CropOptimalConditions> = {
  pepper: {
    cropType: "Pepper",
    temperature: { min: 18, optimal: 24, max: 28 },
    humidity: { min: 60, optimal: 70, max: 80 },
    co2: { min: 800, optimal: 1000, max: 1200 },
    light: { min: 200, optimal: 300, max: 400 },
  },
  tomato: {
    cropType: "Tomato",
    temperature: { min: 16, optimal: 22, max: 26 },
    humidity: { min: 65, optimal: 75, max: 85 },
    co2: { min: 800, optimal: 1000, max: 1200 },
    light: { min: 250, optimal: 350, max: 450 },
  },
  cucumber: {
    cropType: "Cucumber",
    temperature: { min: 18, optimal: 25, max: 30 },
    humidity: { min: 70, optimal: 80, max: 90 },
    co2: { min: 800, optimal: 1000, max: 1200 },
    light: { min: 200, optimal: 300, max: 400 },
  },
  lettuce: {
    cropType: "Lettuce",
    temperature: { min: 12, optimal: 18, max: 22 },
    humidity: { min: 50, optimal: 60, max: 70 },
    co2: { min: 600, optimal: 800, max: 1000 },
    light: { min: 150, optimal: 250, max: 350 },
  },
}
