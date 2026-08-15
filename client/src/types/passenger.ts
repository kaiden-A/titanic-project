export interface Passenger {
  pclass: number
  sex: 'male' | 'female'
  age: number | null
  sibsp: number
  parch: number
  fare: number
  embarked: 'C' | 'S' | 'Q' | null
  name: string
}

export interface PredictionResponse {
  survival_probability: number
}

export interface HealthResponse {
  status: string
  model_loaded: boolean
}