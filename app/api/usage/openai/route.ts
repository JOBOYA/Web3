import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer les statistiques d'utilisation depuis la base de données
    const usage = await prisma.openAIUsage.findFirst({
      where: {
        userId: userId
      }
    })

    // Si pas d'enregistrement, créer un nouveau
    if (!usage) {
      const newUsage = await prisma.openAIUsage.create({
        data: {
          userId: userId,
          totalUsed: 0,
          totalAvailable: 100,
          resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }
      })

      return NextResponse.json({
        total_used: newUsage.totalUsed,
        total_available: newUsage.totalAvailable,
        percentage: 0,
        reset_date: newUsage.resetDate
      })
    }

    return NextResponse.json({
      total_used: usage.totalUsed,
      total_available: usage.totalAvailable,
      percentage: (usage.totalUsed / usage.totalAvailable) * 100,
      reset_date: usage.resetDate
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 