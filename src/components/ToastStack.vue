<script setup lang="ts">
import { useNotificationStore } from '@/store/notifications'

const notifications = useNotificationStore()

const iconByType: Record<string, string> = {
  success: '✓',
  error: '!',
  info: 'i',
}
</script>

<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast" tag="div" class="toast-list">
      <div
        v-for="item in notifications.items"
        :key="item.id"
        class="toast"
        :class="`toast--${item.type}`"
        role="status"
      >
        <div class="toast__icon">{{ iconByType[item.type] }}</div>
        <p class="toast__message">{{ item.message }}</p>
        <button type="button" class="toast__close" @click="notifications.remove(item.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;
}

.toast-list {
  display: grid;
  gap: 12px;
  width: min(360px, calc(100vw - 32px));
}

.toast {
  pointer-events: auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 18px 40px rgba(18, 32, 51, 0.18);
  border: 1px solid rgba(255, 122, 21, 0.12);
  backdrop-filter: blur(10px);
}

.toast--success {
  border-left: 4px solid #22c55e;
}

.toast--error {
  border-left: 4px solid #ef4444;
}

.toast--info {
  border-left: 4px solid #f97316;
}

.toast__icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  background: #f97316;
}

.toast--success .toast__icon {
  background: #22c55e;
}

.toast--error .toast__icon {
  background: #ef4444;
}

.toast__message {
  margin: 0;
  color: #16243c;
  font-weight: 600;
  line-height: 1.45;
}

.toast__close {
  border: 0;
  background: transparent;
  color: #94a3b8;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@media (max-width: 640px) {
  .toast-stack {
    top: 12px;
    right: 12px;
    left: 12px;
  }

  .toast-list {
    width: 100%;
  }
}
</style>
