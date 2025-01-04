import './globals.css'
import { Space_Mono } from 'next/font/google'

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin']
})

export const metadata = {
  title: 'Rastreador de Treino',
  description: 'Acompanhe seus treinos e mantenha a consistência',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${spaceMono.className} bg-background text-foreground`}>
        <div className="min-h-screen">
          <header className="p-4 border-b-2 border-primary">
            <h1 className="text-2xl font-bold neon-text tracking-wider">RASTREADOR DE TREINO</h1>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

