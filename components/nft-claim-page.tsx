'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Star, Shield, Zap } from "lucide-react"

export function NftClaimPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleConnectWallet = () => {
    setIsWalletConnected(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-950 to-black text-white">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm sticky top-0 z-10"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl font-bold">LAYER3</span>
        </motion.div>
        <Button 
          variant="outline"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
          onClick={handleConnectWallet}
        >
          <Wallet className="w-4 h-4" />
          {isWalletConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </motion.nav>

      <main className="container mx-auto px-4 py-12">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="space-y-4 max-w-3xl">
            <div className="text-sm text-gray-400">Polygon Labs</div>
            <h1 className="text-5xl font-bold mb-6">
              Claim your Governance NFT
            </h1>
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                <span className="mr-1">📊</span> Beginner
              </Badge>
              <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                <span className="mr-1">⬡</span> Polygon
              </Badge>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-purple-600/20 p-1"
          >
            <img
              src="/placeholder.svg?height=400&width=400"
              alt="Governance NFT Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
          <div className="space-y-6 flex flex-col justify-center">
            <Card className="bg-black/40 border-blue-900/50 backdrop-blur-sm hover:border-blue-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">About this NFT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  This Governance NFT grants you voting rights in the Polygon ecosystem. 
                  Participate in key decisions and help shape the future of the network.
                </p>
              </CardContent>
            </Card>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Claim NFT
            </Button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Holder Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Star, 
                title: "Voting Rights", 
                description: "Participate in governance decisions on the Polygon network." 
              },
              { 
                icon: Shield, 
                title: "Early Access", 
                description: "Get priority access to new features and updates." 
              },
              { 
                icon: Zap, 
                title: "Community Status", 
                description: "Join an exclusive community of governance token holders." 
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-black/40 border-blue-900/50 backdrop-blur-sm hover:border-blue-700/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <benefit.icon className="w-5 h-5 text-blue-400" />
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}