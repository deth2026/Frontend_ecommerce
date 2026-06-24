import api from './api'
import { unwrapArray, unwrapItem } from './response'

export const getProductReviews = async (productId: number) => {
  const response = await api.get(`/products/${productId}/reviews`)
  return { ...response, data: unwrapArray(response.data) }
}

export const createReview = async (payload: {
  product_id: number
  rating: number
  comment: string
}) => {
  const response = await api.post('/reviews', payload)
  return { ...response, data: unwrapItem(response.data) }
}
