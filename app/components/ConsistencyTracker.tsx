'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkoutHistory {
  date: string
  workoutId: number
  completed: boolean
  intensity: number
}

export default function ConsistencyTracker() {
  const [history, setHistory] = useState<WorkoutHistory[]>([])

  useEffect(() => {
    fetch('/api/history')
      .then(response => response.json())
      .then(data => setHistory(data.userHistory))
  }, [])

  const getIntensityColor = (intensity: number) => {
    const colors = ['#003300', '#006600', '#009900', '#00cc00', '#00ff00']
    return colors[intensity] || colors[0]
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getCurrentStreak = () => {
    let streak = 0
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const today = new Date().toISOString().split('T')[0]

    for (let i = 0; i < sortedHistory.length; i++) {
      const date = new Date(sortedHistory[i].date)
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (date.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0] && sortedHistory[i].completed) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const renderContributionGraph = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const daysInMonth = getDaysInMonth(year, month)

    return (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = new Date(year, month, index + 1).toISOString().split('T')[0];
          const workout = history.find(h => h.date === date);
          const intensity = workout ? workout.intensity : 0;

          return (
            <div
              key={date}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getIntensityColor(intensity) }}
              title={`${date}: Intensidade ${intensity}`}
            />
          );
        })}
      </div>
    )
  }

  return (
    <Card className="retro-card mt-8">
      <CardHeader>
        <CardTitle className="text-xl neon-text uppercase">Rastreador de Consistência</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase">Sequência Atual</h3>
              <p className="text-2xl font-bold neon-text">{getCurrentStreak()} dias</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary uppercase">Este Mês</h3>
              <p className="text-2xl font-bold neon-text">{history.filter(h => h.completed).length} treinos</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 text-primary uppercase">Gráfico de Contribuição</h3>
            <div className="p-2 retro-card">
              {renderContributionGraph()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

