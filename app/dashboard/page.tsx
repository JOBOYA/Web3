'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Sparkles, Star, Trash2 } from "lucide-react"
import { useCollectionStore } from '../store/useCollectionStore'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null)
  const { addImage, toggleFavorite, removeImage } = useCollectionStore()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage('')
    setIsSuccess(false)
    setGeneratedImage(null)
    setGeneratedImageId(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setGeneratedImage(data.imageUrl)
      const newId = crypto.randomUUID()
      setGeneratedImageId(newId)
      
      addImage({
        imageUrl: data.imageUrl,
        address: address,
        isFavorite: false
      })
      
      setMessage('Image générée avec succès !')
      setIsSuccess(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Erreur : ${error.message}`)
      } else {
        setMessage('Une erreur inattendue est survenue')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#171923] p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] mb-2">
            KRC20 NFT Generator
          </h1>
          <p className="text-gray-400">
            Transformez votre adresse Kaspa en œuvre d'art unique
          </p>
        </motion.div>

        <Card className="w-full max-w-md mx-auto backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Générer une Image NFT</CardTitle>
            <CardDescription className="text-gray-400">
              Utilisez votre adresse Kaspa pour générer une image unique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Adresse Kaspa</Label>
                <div className="relative">
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="kaspa:..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                  <motion.div
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-4 w-4 text-[#4fd1c5]" />
                  </motion.div>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] hover:opacity-90 transition-opacity rounded-xl"
                disabled={isLoading}
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
            </motion.form>

            {generatedImage && generatedImageId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 relative group"
              >
                <img 
                  src={generatedImage} 
                  alt="Generated NFT" 
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ minHeight: '200px', objectFit: 'contain' }}
                />
                
                <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    className="p-2 rounded-full bg-black/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(generatedImageId)}
                  >
                    <Star className="w-5 h-5 text-white hover:text-[#4fd1c5] transition-colors" />
                  </motion.button>

                  <motion.button
                    className="p-2 rounded-full bg-black/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      removeImage(generatedImageId)
                      setGeneratedImage(null)
                      setGeneratedImageId(null)
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </motion.button>
                </div>

                <motion.div 
                  className="mt-2 text-sm text-gray-400 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Image générée à partir de l'adresse
                </motion.div>
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  variant={isSuccess ? "default" : "destructive"} 
                  className={`mt-4 ${isSuccess ? 'bg-[#4fd1c5]/10 border-[#4fd1c5]/20' : ''}`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{isSuccess ? 'Succès' : 'Erreur'}</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}