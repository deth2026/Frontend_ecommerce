import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info'

export interface NotificationItem {
  id: number
  type: NotificationType
  message: string
}

export const useNotificationStore = defineStore('notifications', () => {
  const items = ref<NotificationItem[]>([])
  let nextId = 1

  const remove = (id: number) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const push = (message: string, type: NotificationType = 'success', duration = 2600) => {
    const id = nextId++
    items.value.push({ id, type, message })

    window.setTimeout(() => {
      remove(id)
    }, duration)
  }

  const success = (message: string, duration?: number) => push(message, 'success', duration)
  const error = (message: string, duration?: number) => push(message, 'error', duration)
  const info = (message: string, duration?: number) => push(message, 'info', duration)

  return {
    items,
    remove,
    success,
    error,
    info,
  }
})
