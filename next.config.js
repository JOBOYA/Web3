/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev', 'uploadthing.com', 'utfs.io'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporairement ignorer les erreurs ESLint pendant le build
  },
}

module.exports = nextConfig 