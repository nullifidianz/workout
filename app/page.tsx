import WorkoutManagement from './components/WorkoutManagement'
import ConsistencyTracker from './components/ConsistencyTracker'

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center mb-2 neon-text">Rastreador de Treino</h1>
      <h2 className="text-xl font-bold text-center mb-8 text-primary">Otimize Seu Corpo, Aprimore Sua Mente</h2>
      <WorkoutManagement />
      <ConsistencyTracker />
    </div>
  )
}

