'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Set {
  type: string
  reps: number
}

interface Exercise {
  name: string
  sets: Set[]
}

interface Workout {
  id: number
  name: string
  days: string[]
  exercises: Exercise[]
}

export default function WorkoutManagement() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/workouts')
      .then(response => response.json())
      .then(data => setWorkouts(data.workouts))
  }, [])

  const filteredWorkouts = selectedDay
    ? workouts.filter(workout => workout.days.includes(selectedDay))
    : workouts

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout)
    setCompletedExercises([])
  }

  const handleExerciseToggle = (exerciseName: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseName)
        ? prev.filter(name => name !== exerciseName)
        : [...prev, exerciseName]
    )
  }

  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="text-xl neon-text uppercase">Treinos Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedDay}>
          <SelectTrigger className="w-full mb-4 retro-select">
            <SelectValue placeholder="Selecione um dia" />
          </SelectTrigger>
          <SelectContent className="retro-card border-primary">
            <SelectItem value="Monday">Segunda</SelectItem>
            <SelectItem value="Tuesday">Terça</SelectItem>
            <SelectItem value="Wednesday">Quarta</SelectItem>
            <SelectItem value="Thursday">Quinta</SelectItem>
            <SelectItem value="Friday">Sexta</SelectItem>
            <SelectItem value="Saturday">Sábado</SelectItem>
            <SelectItem value="Sunday">Domingo</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorkouts.map(workout => (
            <Card key={workout.id} className="retro-card">
              <CardHeader>
                <CardTitle className="text-primary uppercase">{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleWorkoutSelect(workout)} className="w-full mb-4 retro-button">
                  Ver Exercícios
                </Button>
                {selectedWorkout && selectedWorkout.id === workout.id && (
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="checkbox-container">
                        <Checkbox
                          id={`exercise-${index}`}
                          checked={completedExercises.includes(exercise.name)}
                          onCheckedChange={() => handleExerciseToggle(exercise.name)}
                          className="border-primary"
                        />
                        <label htmlFor={`exercise-${index}`} className="checkbox-label text-foreground">
                          {exercise.name} - {exercise.sets.map((set, i) => `${set.reps} ${set.type}`).join(', ')}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`/workout/${workout.id}`} className="block mt-4">
                  <Button className="w-full retro-button">
                    Iniciar Treino <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

