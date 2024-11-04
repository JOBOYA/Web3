'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

type PriceData = {
  prices: [number, number][] // [timestamp, price]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export default function Stats() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/kaspa/market_chart?vs_currency=usd&days=30&interval=daily'
        )
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }

        const data: PriceData = await response.json()
        setPriceData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [])

  const chartData = {
    labels: priceData?.prices.map(price => 
      new Date(price[0]).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      })
    ),
    datasets: [
      {
        label: 'Prix KAS (USD)',
        data: priceData?.prices.map(price => price[1]),
        fill: true,
        borderColor: '#4fd1c5',
        backgroundColor: 'rgba(79, 209, 197, 0.1)',
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: '#4fd1c5',
        pointBorderColor: '#4fd1c5',
        pointHoverRadius: 5,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(28, 69, 50, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(79, 209, 197, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toFixed(4)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
          callback: function(value: any) {
            return `$${value.toFixed(4)}`
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#171923] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] mb-8">
          Statistiques Kaspa
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Prix actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#4fd1c5]">
                ${priceData?.prices?.[priceData.prices.length - 1]?.[1]?.toFixed(4) ?? '0.0000'}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Volume 24h</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#4fd1c5]">
                ${((priceData?.total_volumes?.[priceData.total_volumes.length - 1]?.[1] ?? 0) / 1000000).toFixed(2)}M
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Évolution du prix sur 30 jours</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                Chargement des données...
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center text-red-400">
                {error}
              </div>
            ) : (
              <div className="h-[400px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 