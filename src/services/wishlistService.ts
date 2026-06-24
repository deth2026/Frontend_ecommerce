import api from './api'
import { unwrapArray, unwrapItem } from './response'

export const getWishlist = async () => {
  const response = await api.get('/wishlist')
  return { ...response, data: unwrapArray(response.data) }
}

export const addToWishlist = async (product_id: number) => {
  const response = await api.post('/wishlist', { product_id })
  return { ...response, data: unwrapItem(response.data) }
}

export const removeFromWishlist = async (productId: number) => {
  const response = await api.delete(`/wishlist/${productId}`)
  return { ...response, data: unwrapItem(response.data) }
}
