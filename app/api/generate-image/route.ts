import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

function isValidKaspaAddress(address: string): boolean {
  return address.startsWith('kaspa:') && address.length >= 10
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer et logger les données de la requête
    const { address } = await req.json()
    console.log('Données reçues:', { address })

    if (!isValidKaspaAddress(address)) {
      return NextResponse.json(
        { error: 'Adresse Kaspa invalide' },
        { status: 400 }
      )
    }

    // Vérifier le quota de l'utilisateur
    const userUsage = await prisma.openAIUsage.findFirst({
      where: { userId }
    })

    if (!userUsage) {
      await prisma.openAIUsage.create({
        data: {
          userId,
          totalUsed: 0,
          totalAvailable: 100,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      })
    } else if (userUsage.totalUsed >= userUsage.totalAvailable) {
      return NextResponse.json(
        { error: 'Quota dépassé. Veuillez attendre le reset.' }, 
        { status: 403 }
      )
    }

    // Générer le prompt basé sur l'adresse
    const addressHash = address.slice(-8)
    const prompt = `Create a unique abstract digital art piece with these specific requirements:
                   1. Base the design on the code ${addressHash}
                   2. Use geometric shapes and modern style with vibrant colors
                   3. Include a subtle "KRC20" signature in turquoise green (#40E0D0) in the bottom right corner
                   4. The overall color scheme should include shades of turquoise and teal
                   5. Create a high-end NFT artwork with crypto-art aesthetics
                   6. Include hexagonal patterns and blockchain-inspired elements
                   7. The signature should be elegant and not too prominent, but clearly readable
                   8. The turquoise elements should create a glowing effect
                   Make it look professional and suitable for a blockchain platform.`

    // Générer l'image avec DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    })

    const imageUrl = response.data[0].url

    if (!imageUrl) {
      throw new Error('Pas d\'URL d\'image générée')
    }

    // Sauvegarder l'image générée
    const generatedImage = await prisma.generatedImage.create({
      data: {
        userId,
        prompt,
        imageUrl,
        kaspaAddress: address,
        isFavorite: false
      }
    })

    // Mettre à jour le quota
    if (userUsage?.id) {
      await prisma.openAIUsage.update({
        where: { id: userUsage.id },
        data: { totalUsed: (userUsage.totalUsed || 0) + 1 }
      })
    }

    return NextResponse.json({ 
      success: true,
      imageUrl,
      id: generatedImage.id
    })

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
} 