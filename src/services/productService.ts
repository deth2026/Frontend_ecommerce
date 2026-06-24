import api from './api'
import { unwrapArray, unwrapItem } from './response'

export const getProducts = async () => {
  const response = await api.get('/products')
  return { ...response, data: unwrapArray(response.data) }
}

export const searchProducts = async (query: string) => {
  const response = await api.get('/products/search', { params: { q: query } })
  return { ...response, data: unwrapArray(response.data) }
}

export const getProductsByCategory = async (categoryId: number) => {
  const response = await api.get(`/products/category/${categoryId}`)
  return { ...response, data: unwrapArray(response.data) }
}

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`)
  return { ...response, data: unwrapItem(response.data) }
}
