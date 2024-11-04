'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUser, useClerk } from '@clerk/nextjs'
import { 
  Settings, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Trash2, 
  Shield, 
  Download,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

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

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    try {
      setIsDeleting(true)
      // Supprimer le compte
      await user?.delete()
      // Se déconnecter
      await signOut()
      // Rediriger vers la page de connexion
      router.push('/sign-in')
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error)
      setShowDeleteConfirm(false)
      // Afficher une alerte d'erreur si nécessaire
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportData = () => {
    // Logique pour exporter les données
    const data = {
      user: {
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.fullName,
      },
      // Ajoutez d'autres données à exporter
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mes-donnees-krc20.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c4532] via-[#1a202c] to-[#171923] p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] to-[#2c7a7b] mb-8"
        >
          Paramètres
        </motion.h1>

        {/* Profil */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="w-5 h-5 mr-2 text-[#4fd1c5]" />
                Profil
              </CardTitle>
              <CardDescription>Gérez vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {user?.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-2 border-[#4fd1c5]"
                  />
                )}
                <div>
                  <p className="text-white font-medium">{user?.fullName}</p>
                  <p className="text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Préférences */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="w-5 h-5 mr-2 text-[#4fd1c5]" />
                Préférences
              </CardTitle>
              <CardDescription>Personnalisez votre expérience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Mode sombre</Label>
                  <p className="text-sm text-gray-400">Activer le thème sombre</p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-[#4fd1c5]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Notifications</Label>
                  <p className="text-sm text-gray-400">Recevoir des notifications</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-[#4fd1c5]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sécurité */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-lg bg-[#1c4532]/20 border-[#4fd1c5]/10 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="w-5 h-5 mr-2 text-[#4fd1c5]" />
                Sécurité et données
              </CardTitle>
              <CardDescription>Gérez vos données et la sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5]/10"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter mes données
              </Button>

              {showDeleteConfirm ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Êtes-vous sûr ?</AlertTitle>
                  <AlertDescription>
                    Cette action est irréversible. Toutes vos données seront supprimées.
                    <div className="mt-4 flex space-x-4">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suppression en cours...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Confirmer la suppression
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                      >
                        Annuler
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer mon compte
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
} 