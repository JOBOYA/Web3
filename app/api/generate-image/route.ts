import { NextResponse } from 'next/server'

function isValidKaspaAddress(address: string): boolean {
  return address.startsWith('kaspa:') && address.length >= 10
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Clé API OpenAI non configurée' },
      { status: 500 }
    )
  }

  try {
    const { address } = await request.json()

    if (!isValidKaspaAddress(address)) {
      return NextResponse.json(
        { error: 'Adresse Kaspa invalide' },
        { status: 400 }
      )
    }

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

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
        style: "vivid"
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Erreur lors de la génération de l\'image')
    }

    const data = await response.json()
    const imageUrl = data.data[0].url

    if (!imageUrl) {
      throw new Error('Pas d\'image générée')
    }

    console.log('URL de l\'image générée:', imageUrl)

    return NextResponse.json({ 
      imageUrl,
      message: 'Image générée avec succès'
    })
  } catch (error) {
    console.error('Erreur génération image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la génération de l\'image' },
      { status: 500 }
    )
  }
} 