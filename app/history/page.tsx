'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCollectionStore } from '../store/useCollectionStore'
import { Image, Trash2, Download, Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

type HistoryItem = {
  id: string
  type: 'generation' | 'deletion' | 'export'
  description: string
  timestamp: string
  address?: string
  imageUrl?: string
}

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

export default function History() {
  const { history } = useCollectionStore()
  const [filter, setFilter] = useState<'all' | 'generation' | 'deletion' | 'export'>('all')

  const filteredHistory = history.filter(item => 
    filter === 'all' ? true : item.type === filter
  )

  const getIcon = (type: string) => {
    switch (type) {
      case 'generation':
        return <Image className="h-5 w-5 text-[#4fd1c5]" />
      case 'deletion':
        return <Trash2 className="h-5 w-5 text-red-400" />
      case 'export':
        return <Download className="h-5 w-5 text-blue-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#171923] p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b]"
          >
            Historique
          </motion.h1>
          <motion.div variants={itemVariants} className="flex space-x-2">
            <Button
              variant="ghost"
              className={`${filter === 'all' ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]' : 'text-gray-400'}`}
              onClick={() => setFilter('all')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Tout
            </Button>
            <Button
              variant="ghost"
              className={`${filter === 'generation' ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]' : 'text-gray-400'}`}
              onClick={() => setFilter('generation')}
            >
              <Image className="h-4 w-4 mr-2" />
              Générations
            </Button>
            <Button
              variant="ghost"
              className={`${filter === 'deletion' ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]' : 'text-gray-400'}`}
              onClick={() => setFilter('deletion')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Suppressions
            </Button>
            <Button
              variant="ghost"
              className={`${filter === 'export' ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]' : 'text-gray-400'}`}
              onClick={() => setFilter('export')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exports
            </Button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              Aucun historique disponible
            </div>
          ) : (
            filteredHistory.map((item) => (
              <Card 
                key={item.id}
                className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-white/5">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">
                          {item.description}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                      {item.address && (
                        <p className="text-sm text-gray-400 mt-1">
                          Adresse: {item.address}
                        </p>
                      )}
                    </div>
                    {item.imageUrl && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-16 h-16 rounded-lg overflow-hidden"
                      >
                        <img 
                          src={item.imageUrl} 
                          alt="NFT" 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  )
} 