'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Image, Settings, Menu, X, Wallet, BarChart2, Gift, History, Star, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from './button'
import { useClerk, useUser } from '@clerk/nextjs'

const menuItems = [
  { 
    icon: Home, 
    label: 'Accueil', 
    path: '/',
    description: 'Générer des NFTs'
  },
  { 
    icon: Image, 
    label: 'Collection', 
    path: '/collection',
    description: 'Mes NFTs générés'
  },
  { 
    icon: Wallet, 
    label: 'Wallet', 
    path: '/wallet',
    description: 'Gérer mon wallet'
  },
  { 
    icon: BarChart2, 
    label: 'Stats', 
    path: '/stats',
    description: 'Statistiques NFT'
  },
  { 
    icon: Gift, 
    label: 'Airdrops', 
    path: '/airdrops',
    description: 'KRC20 Airdrops'
  },
  { 
    icon: History, 
    label: 'Historique', 
    path: '/history',
    description: 'Mes transactions'
  },
  { 
    icon: Star, 
    label: 'Favoris', 
    path: '/favorites',
    description: 'NFTs favoris'
  },
  { 
    icon: Settings, 
    label: 'Paramètres', 
    path: '/settings',
    description: 'Configuration'
  },
]

export function Sidenav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState<string | null>(null)
  const [totalNFTs, setTotalNFTs] = useState<string | null>(null)
  const { signOut } = useClerk()
  const { user } = useUser()

  // Fonction pour récupérer le nombre total de NFTs
  const fetchTotalNFTs = async () => {
    try {
      const response = await fetch('/api/nfts/count')
      const data = await response.json()
      setTotalNFTs(data.count.toString())
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de NFTs:', error)
      setTotalNFTs('0')
    }
  }

  useEffect(() => {
    setWalletBalance('---')
    fetchTotalNFTs() // Appel de la fonction au chargement du composant
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/sign-in')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Fonction pour fermer la sidenav
  const closeSidenav = () => {
    setIsOpen(false)
  }

  // Fonction pour gérer la navigation
  const handleNavigation = (path: string) => {
    router.push(path)
    closeSidenav() // Ferme la sidenav après la navigation
  }

  return (
    <>
      {/* Mobile menu button avec dégradé */}
      <Button
        variant="ghost"
        className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 rounded-full bg-gradient-to-r from-[#1c4532] to-[#1a202c] border border-[#4fd1c5]/20 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="text-[#4fd1c5]" /> : <Menu className="text-[#4fd1c5]" />}
      </Button>

      {/* Overlay avec flou pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidenav}
        />
      )}

      {/* Version mobile avec animation et coins arrondis */}
      {isOpen && (
        <motion.div 
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          className="lg:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#1c4532] shadow-2xl z-50 rounded-r-[40px] border-r border-[#4fd1c5]/10"
        >
          <div className="flex flex-col h-full">
            {/* Header fixe */}
            <div className="p-6 bg-gradient-to-b from-[#1c4532] to-[#1c4532]/95 backdrop-blur-sm">
              <motion.h2 
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] mb-4"
                whileHover={{ scale: 1.05 }}
              >
                KRC20 NFT
              </motion.h2>
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-[#4fd1c5] font-medium">{walletBalance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NFTs</span>
                  <span className="text-[#4fd1c5] font-medium">{totalNFTs}</span>
                </div>
              </div>
            </div>

            {/* Zone de scroll avec les items du menu */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <nav className="p-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.path

                  return (
                    <motion.div
                      key={item.path}
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => handleNavigation(item.path)} // Utilise la nouvelle fonction
                    >
                      <motion.div
                        whileHover={{ 
                          x: 5,
                          style: { background: 'rgba(79, 209, 197, 0.1)' }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-3 rounded-xl transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#4fd1c5]/20 to-[#2c7a7b]/20 text-[#4fd1c5]'
                            : 'text-gray-400 hover:text-[#4fd1c5]'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Footer avec bouton de déconnexion */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-t from-[#1a202c] to-[#1a202c]/95 backdrop-blur-sm">
              <motion.div 
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-white/5 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={handleSignOut}
              >
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || 'Avatar'} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#4fd1c5]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] flex items-center justify-center">
                    <LogOut className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.fullName || user?.emailAddresses[0]?.emailAddress || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Déconnexion
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Version desktop reste la même */}
    </>
  )
} 