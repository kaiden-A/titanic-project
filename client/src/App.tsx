import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
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
  embarked: 'S',
  name: '',
}

const CLASS_OPTIONS = [
  { value: 1, label: '1st — First Class', hint: 'Luxury cabins, highest survival rate' },
  { value: 2, label: '2nd — Second Class', hint: 'Middle-class cabins' },
  { value: 3, label: '3rd — Third Class', hint: 'Steerage (basic quarters)' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
}

function App() {
  const [form, setForm] = useState<Passenger>(EMPTY_PASSENGER)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (result === null) return
    const controls = animate(0, result, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayed(v),
    })
    return () => controls.stop()
  }, [result])

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
    <motion.main
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Titanic Survival Predictor</h1>
        <p className="subtitle">Enter passenger details and get a survival probability</p>
      </motion.div>

      <motion.form
        variants={container}
        initial="hidden"
        animate="show"
        onSubmit={submit}
      >
        <motion.div className="grid" variants={item}>
          <label>
            Passenger class
            <select value={form.pclass} onChange={(e) => set('pclass', Number(e.target.value))}>
              {CLASS_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="hint">
              {CLASS_OPTIONS.find((c) => c.value === form.pclass)?.hint}
            </span>
          </label>

          <motion.label variants={item}>
            Sex
            <select value={form.sex} onChange={(e) => set('sex', e.target.value as 'male' | 'female')}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </motion.label>

          <motion.label variants={item}>
            Age
            <input
              type="number"
              min={0}
              max={120}
              value={form.age ?? ''}
              onChange={(e) => set('age', e.target.value === '' ? null : Number(e.target.value))}
            />
          </motion.label>

          <motion.label variants={item}>
            Siblings / spouses aboard
            <input
              type="number"
              min={0}
              value={form.sibsp}
              onChange={(e) => set('sibsp', Number(e.target.value))}
            />
          </motion.label>

          <motion.label variants={item}>
            Parents / children aboard
            <input
              type="number"
              min={0}
              value={form.parch}
              onChange={(e) => set('parch', Number(e.target.value))}
            />
          </motion.label>

          <motion.label variants={item}>
            Fare (£)
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.fare}
              onChange={(e) => set('fare', Number(e.target.value))}
            />
          </motion.label>

          <motion.label variants={item}>
            Embarked
            <select
              value={form.embarked ?? ''}
              onChange={(e) =>
                set('embarked', e.target.value === '' ? null : (e.target.value as 'C' | 'S' | 'Q'))
              }
            >
              <option value="">Unknown</option>
              <option value="C">Cherbourg (C)</option>
              <option value="S">Southampton (S)</option>
              <option value="Q">Queenstown (Q)</option>
            </select>
            <span className="hint">
              Port where the passenger boarded — S = Southampton (England), C = Cherbourg (France),
              Q = Queenstown (Ireland). Leave Unknown if unsure, the model fills it in.
            </span>
          </motion.label>

          <motion.label className="full" variants={item}>
            Name (optional)
            <input
              type="text"
              placeholder="e.g. Mr. John Smith"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </motion.label>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)' }}
          whileTap={{ scale: 0.98 }}
          variants={item}
        >
          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="loading"
              >
                <span className="spinner" />
                Predicting…
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                Predict survival
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {result !== null && !loading && (
          <motion.section
            className="result"
            data-survived={result >= 0.5}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <h2>Survival probability: {(displayed * 100).toFixed(1)}%</h2>
            <p>{result >= 0.5 ? 'Predicted to survive' : 'Predicted not to survive'}</p>
            <div className="bar">
              <motion.div
                className="bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${result * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.section>
        )}

        {error && !loading && (
          <motion.section
            className="result error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p>{error}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  )
}

export default App