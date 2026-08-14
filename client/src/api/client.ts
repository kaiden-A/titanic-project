import type { HealthResponse, Passenger, PredictionResponse } from '../types/passenger'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail ?? `Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health')
}

export function predictSurvival(passenger: Passenger): Promise<PredictionResponse> {
  return request<PredictionResponse>('/api/predict', {
    method: 'POST',
    body: JSON.stringify(passenger),
  })
}