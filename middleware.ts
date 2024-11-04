import { clerkMiddleware } from '@clerk/nextjs/server'

// Définir les routes publiques
const publicPaths = ['/sign-in(.*)', '/sign-up(.*)', '/api/(.*)']

export default clerkMiddleware(async (auth, req) => {
  // Vérifier si l'URL actuelle est une route publique
  const isPublic = publicPaths.some(path => {
    const regex = new RegExp(`^${path}$`)
    return regex.test(req.nextUrl.pathname)
  })

  // Si c'est une route publique, autoriser l'accès
  if (isPublic) {
    return
  }

  // Pour toutes les autres routes, vérifier l'authentification
  try {
    await auth.protect()
  } catch {
    // Créer une nouvelle URL pour la redirection
    const url = new URL('/sign-in', req.url)
    url.searchParams.set('redirect_url', req.url)
    
    // Créer une nouvelle Response avec les headers appropriés
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        'Content-Type': 'text/plain',
      },
    })
  }
})

// Configurer les routes à gérer par le middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}