import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import ActiveWorkout from '../../components/ActiveWorkout'

export default function WorkoutPage({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'data', 'workouts.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents)

  const workout = data.workouts.find((w: any) => w.id === parseInt(params.id))

  if (!workout) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Active Workout</h1>
      <ActiveWorkout workout={workout} />
    </div>
  )
}

