'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const GenerateForm: React.FC = () => {
  const [kaspaAddress, setKaspaAddress] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: kaspaAddress }),
      })

      const data = await response.json()
      console.log('Réponse API:', data) // Debug

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de la génération')
      }

      if (!data.url && !data.imageUrl) {
        throw new Error('URL de l\'image manquante dans la réponse')
      }

      // Utilise imageUrl ou url selon ce qui est disponible
      setGeneratedImage(data.imageUrl || data.url)
    } catch (error: any) {
      setError(error.message)
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Générer une Image NFT</CardTitle>
        <CardDescription>
          Entrez votre adresse Kaspa pour créer une œuvre d'art unique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="kaspa:qqr4qw..."
              value={kaspaAddress}
              onChange={(e) => setKaspaAddress(e.target.value)}
              required
              pattern="kaspa:.+"
              title="L'adresse doit commencer par 'kaspa:'"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !kaspaAddress.startsWith('kaspa:')}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              'Générer l\'image'
            )}
          </Button>
          
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          
          {generatedImage && (
            <div className="mt-4">
              <img 
                src={generatedImage} 
                alt="Generated NFT" 
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Erreur de chargement image:', e)
                  setError('Erreur lors du chargement de l\'image')
                }}
              />
              <div className="mt-2 text-sm text-gray-500">
                Image générée avec succès
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default GenerateForm