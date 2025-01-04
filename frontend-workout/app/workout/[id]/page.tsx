'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import ActiveWorkout from '../../components/ActiveWorkout'

interface Workout {
  id: number
  name: string
  days: string[]
  exercises: {
    name: string
    sets: {
      type: string
      reps: number
    }[]
  }[]
}

export default function WorkoutPage({ params }: { params: { id: string } }) {
  const [workout, setWorkout] = useState<Workout | null>(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/workouts')
      .then(response => response.json())
      .then(data => {
        const foundWorkout = data.workouts.find((w: Workout) => w.id === parseInt(params.id))
        if (foundWorkout) {
          setWorkout(foundWorkout)
        } else {
          notFound()
        }
      })
  }, [params.id])

  if (!workout) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8 neon-text uppercase">Treino Ativo</h1>
      <ActiveWorkout workout={workout} />
    </div>
  )
}

