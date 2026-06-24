import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addToCart as apiAddToCart, getCart, removeCartItem, updateCartItem } from '@/services/cartService'
import { useNotificationStore } from '@/store/notifications'

export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([])
  const loading = ref(false)
  const error = ref('')

  const redirectToLogin = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  const normalizeItem = (item: any) => ({
    id: item.id,
    quantity: item.quantity ?? 1,
    price: Number(item.price ?? item.product?.price ?? 0),
    product: item.product ?? item,
    product_id: item.product_id ?? item.product?.id ?? item.id,
  })

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
  )

  const loadCart = async () => {
    loading.value = true
    error.value = ''

    try {
      const response = await getCart()
      items.value = (response.data || []).map(normalizeItem)
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      error.value = 'Failed to load cart.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (product: any, quantity = 1) => {
    try {
      await apiAddToCart({ product_id: product.id, quantity })
      await loadCart()
      useNotificationStore().success(`Added to cart successfully`)
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      throw err
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      await removeCartItem(itemId)
      items.value = items.value.filter((i) => i.id !== itemId)
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      throw err
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    try {
      await updateCartItem(itemId, quantity)
      const item = items.value.find((i) => i.id === itemId)
      if (item) item.quantity = quantity
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        redirectToLogin()
        return
      }
      throw err
    }
  }

  const clearCart = async () => {
    items.value = []
  }

  return {
    items,
    loading,
    error,
    totalItems,
    totalPrice,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
