'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCollectionStore } from '../store/useCollectionStore'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart, Share2, Download } from "lucide-react"
import { useState } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

type ViewMode = 'grid' | 'masonry'

export default function Favorites() {
  const { images, toggleFavorite } = useCollectionStore()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const favoriteImages = images.filter(img => img.isFavorite)

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
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b]">
              Mes Favoris
            </h1>
            <p className="text-gray-400 mt-2">
              {favoriteImages.length} NFT{favoriteImages.length > 1 ? 's' : ''} favori{favoriteImages.length > 1 ? 's' : ''}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex space-x-2">
            <Button
              variant="ghost"
              className={`${viewMode === 'grid' ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]' : 'text-gray-400'}`}
              onClick={() => setViewMode('grid')}
            >
              Grille
            </Button>
            <Button
              variant="ghost"
              className={`${viewMode === 'masonry' ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]' : 'text-gray-400'}`}
              onClick={() => setViewMode('masonry')}
            >
              Mosaïque
            </Button>
          </motion.div>
        </div>

        {favoriteImages.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-20"
          >
            <Star className="w-16 h-16 text-[#4fd1c5] mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-semibold text-white mb-2">Aucun favori</h2>
            <p className="text-gray-400">
              Ajoutez des NFTs à vos favoris en cliquant sur l'étoile
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'columns-1 md:columns-2 lg:columns-3'
            }`}
          >
            <AnimatePresence>
              {favoriteImages.map((image) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  layout
                  className={viewMode === 'masonry' ? 'mb-6' : ''}
                  onMouseEnter={() => setHoveredId(image.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl overflow-hidden group">
                    <CardContent className="p-0 relative">
                      <motion.img
                        src={image.imageUrl}
                        alt="NFT"
                        className="w-full aspect-square object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      
                      {/* Overlay avec les actions */}
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
                              onClick={() => toggleFavorite(image.id)}
                            >
                              <Heart className="w-5 h-5 text-[#4fd1c5] fill-current" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 