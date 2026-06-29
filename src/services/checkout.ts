import api from './api'
import { unwrapItem } from './response'

export interface CheckoutPayload {
  name: string
  email: string
  shipping_address: string
  address?: string
  phone: string
  notes?: string
  payment_method: string
}

export const checkout = async (data: CheckoutPayload) => {
  const response = await api.post('/checkout', data)
  return { ...response, data: unwrapItem(response.data) }
}
