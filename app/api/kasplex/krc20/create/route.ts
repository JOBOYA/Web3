import { NextResponse } from 'next/server'

// Fonction de validation d'adresse Kaspa
function isValidKaspaAddress(address: string): boolean {
  // Vérifie si l'adresse commence par 'kaspa:'
  if (!address.startsWith('kaspa:')) {
    return false
  }

  // Vérifie la longueur de l'adresse (kaspa: + 62 caractères)
  if (address.length !== 68) {
    return false
  }

  // Vérifie si les caractères après 'kaspa:' sont valides (alphanumériques)
  const addressPart = address.slice(6)
  const validChars = /^[a-zA-Z0-9]+$/
  return validChars.test(addressPart)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, symbol, totalSupply, address } = body

    // Validation des entrées
    if (!name || !symbol || !totalSupply || !address) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'adresse est valide
    if (!isValidKaspaAddress(address)) {
      return NextResponse.json(
        { error: 'Adresse Kaspa invalide' },
        { status: 400 }
      )
    }

    // Créer le contrat KRC20
    const contractData = {
      name,
      symbol,
      totalSupply: BigInt(totalSupply).toString(),
      decimals: 8,
      owner: address
    }

    // Ici, vous devrez implémenter la logique de déploiement du contrat
    const response = await fetch('https://api.kasplex.org/v1/krc20/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur lors du déploiement du contrat')
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur création token:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la création du token' },
      { status: 500 }
    )
  }
} 