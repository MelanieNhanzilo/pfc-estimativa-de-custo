"use client"

// Simulated ONNX model integration
// In a real implementation, you would use onnxruntime-web

export interface HouseData {
  houseType: string
  year: string
  floors: string
  habitationType: string
  coverageType: string
  foundationType: string
  wallType: string
  area: string
}

export interface PredictionResult {
  total: number
  breakdown: {
    foundation: number
    walls: number
    coverage: number
    finishes: number
  }
  range: {
    min: number
    max: number
  }
}

// Simulated model weights and coefficients
const MODEL_COEFFICIENTS = {
  houseType: { T1: 0.8, T2: 1.0, T3: 1.2, T4: 1.5, T5: 1.8 },
  coverageType: { chapa: 1.0, telha: 1.3, laje: 1.6 },
  foundationType: { simples: 1.0, superficial: 1.2, profunda: 1.5 },
  wallType: { adobe: 0.8, bloco: 1.0, tijolo: 1.2 },
  habitationType: { tradicional: 0.9, convencional: 1.0, moderna: 1.3 },
}

export class ONNXCostPredictor {
  private basePrice = 2000 // Base price per m2

  async predict(data: HouseData): Promise<PredictionResult> {
    // Simulate async model inference
    await new Promise((resolve) => setTimeout(resolve, 500))

    const area = Number.parseInt(data.area) || 100
    const floors = Number.parseInt(data.floors) || 1
    const currentYear = new Date().getFullYear()
    const constructionYear = Number.parseInt(data.year) || currentYear

    // Calculate multipliers based on input features
    const houseTypeMultiplier =
      MODEL_COEFFICIENTS.houseType[data.houseType as keyof typeof MODEL_COEFFICIENTS.houseType] || 1.0
    const coverageMultiplier =
      MODEL_COEFFICIENTS.coverageType[data.coverageType as keyof typeof MODEL_COEFFICIENTS.coverageType] || 1.0
    const foundationMultiplier =
      MODEL_COEFFICIENTS.foundationType[data.foundationType as keyof typeof MODEL_COEFFICIENTS.foundationType] || 1.0
    const wallMultiplier = MODEL_COEFFICIENTS.wallType[data.wallType as keyof typeof MODEL_COEFFICIENTS.wallType] || 1.0
    const habitationMultiplier =
      MODEL_COEFFICIENTS.habitationType[data.habitationType as keyof typeof MODEL_COEFFICIENTS.habitationType] || 1.0

    // Age factor (newer construction costs more)
    const ageFactor = Math.max(0.8, 1 + (constructionYear - currentYear) * 0.02)

    // Calculate total cost
    const baseCost = area * this.basePrice * floors
    const adjustedCost =
      baseCost *
      houseTypeMultiplier *
      coverageMultiplier *
      foundationMultiplier *
      wallMultiplier *
      habitationMultiplier *
      ageFactor

    const total = Math.round(adjustedCost)

    // Calculate breakdown (percentages based on typical construction costs)
    const breakdown = {
      foundation: Math.round(total * 0.2),
      walls: Math.round(total * 0.25),
      coverage: Math.round(total * 0.15),
      finishes: Math.round(total * 0.4),
    }

    // Calculate confidence range (±20%)
    const range = {
      min: Math.round(total * 0.8),
      max: Math.round(total * 1.2),
    }

    return {
      total,
      breakdown,
      range,
    }
  }

  // Method to retrain model with new data (simulation)
  async contributeData(data: HouseData, actualCost?: number): Promise<boolean> {
    // In a real implementation, this would send data to a training pipeline
    console.log("Contributing data to model:", data, actualCost)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  }

  // Method to compare two different configurations
  async compare(
    config1: HouseData,
    config2: HouseData,
  ): Promise<{
    config1Result: PredictionResult
    config2Result: PredictionResult
    difference: number
    percentageDifference: number
  }> {
    const [result1, result2] = await Promise.all([this.predict(config1), this.predict(config2)])

    const difference = result2.total - result1.total
    const percentageDifference = (difference / result1.total) * 100

    return {
      config1Result: result1,
      config2Result: result2,
      difference,
      percentageDifference,
    }
  }
}

// Export singleton instance
export const costPredictor = new ONNXCostPredictor()
