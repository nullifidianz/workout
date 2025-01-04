'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { PlayCircle, PauseCircle, RotateCcw, CheckCircle } from 'lucide-react'

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

interface ActiveWorkoutProps {
  workout: Workout;
}

export default function ActiveWorkout({ workout }: ActiveWorkoutProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])

  const currentExercise = workout.exercises[currentExerciseIndex]
  const currentSet = currentExercise.sets[currentSetIndex]
  const totalExercises = workout.exercises.length

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            new Audio('/beep.mp3').play();
            if (isResting) {
              setIsResting(false);
              setTimer(0);
            }
            return 0;
          }
          return prevTimer - 1;
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, isResting])

  const startTimer = () => {
    setIsRunning(true);
    if (!isResting) {
      setTimer(60); // Default exercise duration
    }
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setTimer(60); // Default exercise duration
  };

  const startRest = () => {
    setIsResting(true);
    setTimer(60); // Default rest time
    setIsRunning(true);
  };

  const nextSet = () => {
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex((prevIndex) => prevIndex + 1);
      startRest();
    } else {
      nextExercise();
    }
  }

  const nextExercise = () => {
    setCompletedExercises(prev => [...prev, currentExercise.name]);
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      setCurrentSetIndex(0);
      setTimer(60); // Default exercise duration
      setIsRunning(false);
      setIsResting(false);
    }
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
        <CardTitle className="text-xl neon-text uppercase">Treino Ativo: {workout.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-primary uppercase">{currentExercise.name}</h3>
            <p className="text-foreground">Série {currentSetIndex + 1} de {currentExercise.sets.length}</p>
            <p className="text-foreground">{currentSet.reps} repetições ({currentSet.type})</p>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-bar-indicator h-2 transition-all duration-300"
              style={{ width: `${(currentExerciseIndex / totalExercises) * 100}%` }}
            />
          </div>

          <div className="text-3xl font-bold text-center neon-text">
            {isResting ? "DESCANSO" : timer}
          </div>

          <div className="flex justify-center space-x-2">
            {isRunning ? (
              <Button onClick={pauseTimer} size="sm" className="retro-button">
                <PauseCircle className="mr-1 h-4 w-4" /> Pausar
              </Button>
            ) : (
              <Button onClick={startTimer} size="sm" className="retro-button">
                <PlayCircle className="mr-1 h-4 w-4" /> Iniciar
              </Button>
            )}
            <Button onClick={resetTimer} size="sm" className="retro-button">
              <RotateCcw className="mr-1 h-4 w-4" /> Reiniciar
            </Button>
          </div>

          <Button onClick={nextSet} size="sm" className="w-full retro-button">
            <CheckCircle className="mr-1 h-4 w-4" /> Completar Série
          </Button>

          <div className="space-y-2 mt-4">
            <h4 className="font-semibold text-primary uppercase">Lista de Exercícios:</h4>
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
        </div>
      </CardContent>
    </Card>
  )
}

