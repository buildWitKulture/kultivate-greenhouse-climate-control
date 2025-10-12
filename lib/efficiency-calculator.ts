import type { GreenhouseZone, CropOptimalConditions, ControlSystemResponse, EfficiencySimulation } from "./types"

export function calculateEfficiencySimulation(
  zone: GreenhouseZone,
  optimalConditions: CropOptimalConditions,
): EfficiencySimulation {
  const responses: ControlSystemResponse[] = []

  // Calculate temperature response
  const tempDiff = zone.temperature.current - optimalConditions.temperature.optimal
  if (Math.abs(tempDiff) > 1) {
    if (tempDiff > 0) {
      // Too hot - increase ventilation, reduce heating
      responses.push({
        system: "Ventilation",
        action: "Increase to cool down",
        intensity: Math.min(100, 50 + Math.abs(tempDiff) * 10),
        estimatedImpact: `${Math.abs(tempDiff).toFixed(1)}°C reduction`,
        timeToEffect: Math.abs(tempDiff) * 5,
      })
      if (zone.heating.percentage > 0) {
        responses.push({
          system: "Heating",
          action: "Reduce or turn off",
          intensity: 0,
          estimatedImpact: "Stop heat generation",
          timeToEffect: 2,
        })
      }
    } else {
      // Too cold - increase heating, reduce ventilation
      responses.push({
        system: "Heating",
        action: "Increase to warm up",
        intensity: Math.min(100, 50 + Math.abs(tempDiff) * 10),
        estimatedImpact: `${Math.abs(tempDiff).toFixed(1)}°C increase`,
        timeToEffect: Math.abs(tempDiff) * 8,
      })
      responses.push({
        system: "Ventilation",
        action: "Reduce to minimum",
        intensity: 20,
        estimatedImpact: "Retain heat",
        timeToEffect: 3,
      })
    }
  }

  // Calculate humidity response
  const humidityDiff = zone.humidity.current - optimalConditions.humidity.optimal
  if (Math.abs(humidityDiff) > 5) {
    if (humidityDiff > 0) {
      // Too humid - increase ventilation
      responses.push({
        system: "Ventilation",
        action: "Increase for dehumidification",
        intensity: Math.min(100, 40 + Math.abs(humidityDiff) * 2),
        estimatedImpact: `${Math.abs(humidityDiff).toFixed(0)}% reduction`,
        timeToEffect: Math.abs(humidityDiff) * 2,
      })
    } else {
      // Too dry - activate misting
      responses.push({
        system: "Misting",
        action: "Activate to increase humidity",
        intensity: Math.min(100, 30 + Math.abs(humidityDiff) * 2),
        estimatedImpact: `${Math.abs(humidityDiff).toFixed(0)}% increase`,
        timeToEffect: Math.abs(humidityDiff) * 1.5,
      })
    }
  }

  // Calculate CO2 response
  const co2Diff = zone.co2.current - optimalConditions.co2.optimal
  if (Math.abs(co2Diff) > 50) {
    if (co2Diff < 0) {
      // Too low - activate CO2 dosing
      responses.push({
        system: "CO2 Dosing",
        action: "Increase CO2 injection",
        intensity: Math.min(100, 50 + (Math.abs(co2Diff) / 200) * 50),
        estimatedImpact: `${Math.abs(co2Diff).toFixed(0)} ppm increase`,
        timeToEffect: Math.abs(co2Diff) / 50,
      })
    } else {
      // Too high - increase ventilation
      responses.push({
        system: "Ventilation",
        action: "Increase to reduce CO2",
        intensity: Math.min(100, 40 + (Math.abs(co2Diff) / 200) * 30),
        estimatedImpact: `${Math.abs(co2Diff).toFixed(0)} ppm reduction`,
        timeToEffect: Math.abs(co2Diff) / 40,
      })
    }
  }

  // Calculate light response
  const lightDiff = zone.light.current - optimalConditions.light.optimal
  if (Math.abs(lightDiff) > 20) {
    if (lightDiff < 0) {
      // Too low - increase artificial lighting
      responses.push({
        system: "Lighting",
        action: "Increase intensity",
        intensity: Math.min(
          100,
          ((optimalConditions.light.optimal - lightDiff) / optimalConditions.light.optimal) * 100,
        ),
        estimatedImpact: `${Math.abs(lightDiff).toFixed(0)} μmol increase`,
        timeToEffect: 1,
      })
    } else {
      // Too high - reduce lighting or close curtains
      responses.push({
        system: "Curtain",
        action: "Partially close to reduce light",
        intensity: Math.min(80, (lightDiff / optimalConditions.light.optimal) * 100),
        estimatedImpact: `${Math.abs(lightDiff).toFixed(0)} μmol reduction`,
        timeToEffect: 2,
      })
    }
  }

  // Calculate estimated recovery time (maximum of all system response times)
  const estimatedRecoveryTime = responses.length > 0 ? Math.max(...responses.map((r) => r.timeToEffect)) : 0

  // Calculate efficiency score (0-100)
  const tempScore = Math.max(0, 100 - Math.abs(tempDiff) * 10)
  const humidityScore = Math.max(0, 100 - Math.abs(humidityDiff) * 2)
  const co2Score = Math.max(0, 100 - (Math.abs(co2Diff) / 200) * 100)
  const lightScore = Math.max(0, 100 - (Math.abs(lightDiff) / 100) * 100)
  const efficiencyScore = (tempScore + humidityScore + co2Score + lightScore) / 4

  return {
    zoneId: zone.id,
    currentConditions: zone,
    optimalConditions,
    controlSystemResponse: responses,
    estimatedRecoveryTime,
    efficiencyScore,
  }
}
