import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  addToWishlist as apiAddToWishlist,
  getWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from '@/services/wishlistService'
import { useNotificationStore } from '@/store/notifications'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const redirectToLogin = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  const totalItems = computed(() => items.value.length)

  const isInWishlist = (productId: number) => {
    return items.value.some((i) => Number(i.id) === Number(productId))
  }

  const loadWishlist = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await getWishlist()
      items.value = (response.data || []).map((item: any) => item.product ?? item)
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      error.value = 'Failed to load wishlist.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const addToWishlist = async (product: any) => {
    if (isInWishlist(product.id)) return
    try {
      await apiAddToWishlist(product.id)
      await loadWishlist()
      useNotificationStore().success(`Added to wishlist successfully`)
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      throw err
    }
  }

  const removeFromWishlist = async (productId: number) => {
    try {
      await apiRemoveFromWishlist(productId)
      items.value = items.value.filter((i) => Number(i.id) !== Number(productId))
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      throw err
    }
  }

  const toggleWishlist = async (product: any) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  return {
    items,
    loading,
    error,
    totalItems,
    isInWishlist,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  }
})
