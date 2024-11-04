'use client'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Loader2, AlertCircle } from 'lucide-react'

interface UsageStatsData {
  total_used: number
  total_available: number
  percentage: number
  reset_date: string
}

export function UsageStats() {
  const [usage, setUsage] = useState<UsageStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage/openai')
        const data = await response.json()
        setUsage(data)
      } catch (error) {
        setError('Erreur lors de la récupération des statistiques')
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [])

  const getColorClass = (percentage: number) => {
    if (percentage < 50) return 'text-green-500'
    if (percentage < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        <AlertCircle className="h-6 w-6 mr-2" />
        {error}
      </div>
    )
  }

  if (!usage) return null

  const daysUntilReset = Math.ceil(
    (new Date(usage.reset_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Utilisation OpenAI</span>
          <span className={`text-2xl font-mono ${getColorClass(usage.percentage)}`}>
            {usage.total_used} / {usage.total_available}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de progression stylisée */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(usage.percentage)}`}
              style={{ width: `${usage.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-400">
            <span>{usage.percentage.toFixed(1)}% utilisé</span>
            <span>{(100 - Number(usage.percentage)).toFixed(1)}% restant</span>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400">Requêtes utilisées</div>
            <div className="text-2xl font-bold">{usage.total_used}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400">Requêtes restantes</div>
            <div className="text-2xl font-bold">{usage.total_available - usage.total_used}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400">Réinitialisation dans</div>
            <div className="text-2xl font-bold">{daysUntilReset} jours</div>
          </div>
        </div>

        {/* Date de réinitialisation */}
        <div className="text-sm text-slate-400 text-center pt-4">
          Réinitialisation le {new Date(usage.reset_date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardContent>
    </Card>
  )
} 