import api from './api'
import { unwrapArray, unwrapItem } from './response'

export const getCart = async () => {
  const response = await api.get('/cart')
  return { ...response, data: unwrapArray(response.data) }
}

export const addToCart = async (payload: { product_id: number; quantity?: number }) => {
  const response = await api.post('/cart', payload)
  return { ...response, data: unwrapItem(response.data) }
}

export const updateCartItem = async (id: number, quantity: number) => {
  const response = await api.put(`/cart/${id}`, { quantity })
  return { ...response, data: unwrapItem(response.data) }
}

export const removeCartItem = async (id: number) => {
  const response = await api.delete(`/cart/${id}`)
  return { ...response, data: unwrapItem(response.data) }
}
