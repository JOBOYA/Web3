'use client'

import { SignIn } from "@clerk/nextjs"
import { motion } from 'framer-motion'
import { Card } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#171923] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] mb-2">
            KRC20 NFT Generator
          </h1>
          <p className="text-gray-400">
            Connectez-vous pour accéder à votre dashboard
          </p>
        </div>

        <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl p-4">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-transparent shadow-none",
                headerTitle: "text-[#4fd1c5]",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 border-white/20 text-white",
                formButtonPrimary: "bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] hover:opacity-90",
                formFieldInput: "bg-white/5 border-white/10 text-white",
                formFieldLabel: "text-gray-400",
                footer: "hidden"
              }
            }}
            path="/sign-in"
            routing="path"
          />
        </Card>
      </motion.div>
    </div>
  )
} 