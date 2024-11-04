import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ count: 0 }, { status: 401 })
    }

    // Compter les images générées pour cet utilisateur
    const count = await prisma.generatedImage.count({
      where: {
        userId: userId
      }
    })
    
    console.log('UserId:', userId)
    console.log('Nombre d\'images générées:', count)
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erreur lors du comptage des NFTs:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
} 