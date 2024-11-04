import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type NFTImage = {
  id: string
  imageUrl: string
  address: string
  createdAt: string
  isFavorite?: boolean
}

type HistoryItem = {
  id: string
  type: 'generation' | 'deletion' | 'export' | 'favorite' | 'unfavorite'
  description: string
  timestamp: string
  address?: string
  imageUrl?: string
}

type CollectionStore = {
  images: NFTImage[]
  history: HistoryItem[]
  favorites: NFTImage[]
  addImage: (image: Omit<NFTImage, 'id' | 'createdAt'>) => void
  removeImage: (id: string) => void
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void
  toggleFavorite: (imageId: string) => void
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set) => ({
      images: [],
      history: [],
      favorites: [],
      addImage: (image) => set((state) => {
        const newImage = {
          ...image,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          isFavorite: false
        }
        
        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          type: 'generation',
          description: 'NFT généré',
          timestamp: new Date().toISOString(),
          address: image.address,
          imageUrl: image.imageUrl
        }

        return {
          images: [...state.images, newImage],
          history: [historyItem, ...state.history]
        }
      }),
      removeImage: (id) => set((state) => {
        const imageToRemove = state.images.find(img => img.id === id)
        
        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          type: 'deletion',
          description: 'NFT supprimé',
          timestamp: new Date().toISOString(),
          address: imageToRemove?.address
        }

        return {
          images: state.images.filter(img => img.id !== id),
          favorites: state.favorites.filter(img => img.id !== id),
          history: [historyItem, ...state.history]
        }
      }),
      addHistoryItem: (item) => set((state) => ({
        ...state,
        history: [{
          ...item,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        } as HistoryItem, ...state.history]
      })),
      toggleFavorite: (imageId) => set((state) => {
        const image = state.images.find(img => img.id === imageId)
        if (!image) return state

        const isFavorite = !image.isFavorite
        const updatedImage = { ...image, isFavorite }

        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          type: isFavorite ? 'favorite' : 'unfavorite',
          description: isFavorite ? 'NFT ajouté aux favoris' : 'NFT retiré des favoris',
          timestamp: new Date().toISOString(),
          address: image.address,
          imageUrl: image.imageUrl
        }

        return {
          images: state.images.map(img => 
            img.id === imageId ? updatedImage : img
          ),
          favorites: isFavorite 
            ? [...state.favorites, updatedImage]
            : state.favorites.filter(img => img.id !== imageId),
          history: [historyItem, ...state.history]
        }
      })
    }),
    {
      name: 'nft-collection'
    }
  )
) 