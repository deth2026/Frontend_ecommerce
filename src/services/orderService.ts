import api from './api'
import { unwrapArray, unwrapItem } from './response'

export const checkoutOrder = async (payload: any) => {
  const response = await api.post('/checkout', payload)
  return { ...response, data: unwrapItem(response.data) }
}

export const getOrders = async () => {
  const response = await api.get('/orders')
  return { ...response, data: unwrapArray(response.data) }
}

export const getOrder = async (id: number) => {
  const response = await api.get(`/orders/${id}`)
  return { ...response, data: unwrapItem(response.data) }
}
