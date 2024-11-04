'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useCollectionStore } from '../store/useCollectionStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowLeft, Star, Share2, Download } from "lucide-react"
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Collection() {
  const { images, removeImage, toggleFavorite } = useCollectionStore()

  const handleShare = async (image: any) => {
    try {
      await navigator.share({
        title: 'Mon NFT KRC20',
        text: `Découvrez mon NFT généré avec l'adresse ${image.address}`,
        url: image.imageUrl
      })
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    }
  }

  const handleDownload = async (image: any) => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nft-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#171923] p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-[#4fd1c5] hover:bg-[#4fd1c5]/10 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] ml-4">
            Ma Collection NFT
          </h1>
        </motion.div>

        {images.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center text-gray-400 py-12"
          >
            <p>Aucune image dans votre collection</p>
            <Link href="/">
              <Button className="mt-4 bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] hover:opacity-90 rounded-xl">
                Générer une image
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {images.map((image) => (
              <motion.div key={image.id} variants={itemVariants}>
                <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl overflow-hidden group relative">
                  <CardContent className="p-0 relative">
                    <motion.img
                      src={image.imageUrl}
                      alt="NFT"
                      className="w-full aspect-square object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    {/* Bouton favori toujours visible */}
                    <motion.button
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/50 z-10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(image.id)}
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          image.isFavorite 
                            ? 'text-[#4fd1c5] fill-current' 
                            : 'text-white hover:text-[#4fd1c5]'
                        }`}
                      />
                    </motion.button>
                    
                    {/* Overlay avec les autres actions */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        flex flex-col justify-end p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium truncate">
                            {image.address}
                          </p>
                          <p className="text-gray-300 text-sm">
                            {new Date(image.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                            onClick={() => handleShare(image)}
                          >
                            <Share2 className="w-5 h-5 text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                            onClick={() => handleDownload(image)}
                          >
                            <Download className="w-5 h-5 text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                            onClick={() => removeImage(image.id)}
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 