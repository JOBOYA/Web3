import { motion } from 'framer-motion'
import { Construction } from 'lucide-react'

export function EmptyState({ title }: { title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6"
    >
      <Construction className="w-16 h-16 text-[#4fd1c5] mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400">Cette page est en cours de construction</p>
    </motion.div>
  )
} 