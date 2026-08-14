import { useState } from 'react'
import { predictSurvival } from './api/client'
import type { Passenger } from './types/passenger'
import './App.css'

const EMPTY_PASSENGER: Passenger = {
  pclass: 2,
  sex: 'female',
  age: 30,
  sibsp: 0,
  parch: 0,
  fare: 32,
  name: '',
}

function App() {
  const [form, setForm] = useState<Passenger>(EMPTY_PASSENGER)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof Passenger>(key: K, value: Passenger[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { survival_probability } = await predictSurvival(form)
      setResult(survival_probability)
    } catch (err) {
      setResult(null)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>Titanic Survival Predictor</h1>
      <p className="subtitle">Enter passenger details and get a survival probability</p>

      <form onSubmit={submit}>
        <div className="grid">
          <label>
            Passenger class
            <select
              value={form.pclass}
              onChange={(e) => set('pclass', Number(e.target.value))}
            >
              <option value={1}>1st</option>
              <option value={2}>2nd</option>
              <option value={3}>3rd</option>
            </select>
          </label>

          <label>
            Sex
            <select value={form.sex} onChange={(e) => set('sex', e.target.value as 'male' | 'female')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label>
            Age
            <input
              type="number"
              min={0}
              max={120}
              value={form.age ?? ''}
              onChange={(e) => set('age', e.target.value === '' ? null : Number(e.target.value))}
            />
          </label>

          <label>
            Siblings / spouses aboard
            <input
              type="number"
              min={0}
              value={form.sibsp}
              onChange={(e) => set('sibsp', Number(e.target.value))}
            />
          </label>

          <label>
            Parents / children aboard
            <input
              type="number"
              min={0}
              value={form.parch}
              onChange={(e) => set('parch', Number(e.target.value))}
            />
          </label>

          <label>
            Fare (£)
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.fare}
              onChange={(e) => set('fare', Number(e.target.value))}
            />
          </label>

          <label className="full">
            Name (optional, used for title extraction)
            <input
              type="text"
              placeholder="e.g. Mr. John Smith"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting…' : 'Predict survival'}
        </button>
      </form>

      {result !== null && (
        <section className="result" data-survived={result >= 0.5}>
          <h2>Survival probability: {(result * 100).toFixed(1)}%</h2>
          <p>{result >= 0.5 ? 'Predicted to survive' : 'Predicted not to survive'}</p>
        </section>
      )}

      {error && (
        <section className="result error">
          <p>{error}</p>
        </section>
      )}
    </main>
  )
}

export default App