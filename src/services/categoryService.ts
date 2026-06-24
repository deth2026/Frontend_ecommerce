import api from './api'
import { unwrapArray, unwrapItem } from './response'

export const getCategories = async () => {
  const response = await api.get('/categories')
  return { ...response, data: unwrapArray(response.data) }
}

export const getCategory = async (id: number) => {
  const response = await api.get(`/categories/${id}`)
  return { ...response, data: unwrapItem(response.data) }
}
