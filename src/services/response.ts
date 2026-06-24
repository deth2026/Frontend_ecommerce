export const unwrapArray = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  if (Array.isArray(payload?.data?.data?.data)) return payload.data.data.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

export const unwrapItem = <T>(payload: any): T => {
  return payload?.data?.data ?? payload?.data ?? payload?.item ?? payload
}

export const toImageUrl = (image?: string | null) => {
  if (!image) return ''

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  const origin = baseURL.replace(/\/api\/?$/, '').replace(/\/$/, '')

  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('/')) return `${origin}${image}`

  return `${origin}/storage/products/${image}`
}
