<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const orderId = route.query.order_id || route.params.orderId || null
const orderTotal = route.query.total || null
</script>

<template>
  <main class="success-page">
    <section class="success-shell">
      <div class="success-card">
        <div class="checkmark-ring">
          <svg class="checkmark" viewBox="0 0 52 52" aria-hidden="true">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>

        <p class="eyebrow">Order confirmed</p>
        <h1>Thank you for your order!</h1>

        <p class="success-message">
          Your order has been placed successfully
          <span v-if="orderId">(#{{ orderId }})</span>.
          We'll send you a confirmation shortly.
        </p>

        <div v-if="orderTotal" class="total-pill">
          Total paid: <strong>${{ Number(orderTotal).toFixed(2) }}</strong>
        </div>

        <div class="action-group">
          <router-link to="/orders" class="solid-btn">
            View My Orders
          </router-link>
          <router-link to="/products" class="ghost-btn">
            Continue Shopping
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.success-shell {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.success-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 122, 21, 0.12);
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(18, 32, 51, 0.07);
  padding: 48px 32px;
  text-align: center;
  display: grid;
  gap: 16px;
  justify-items: center;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #ff7a15;
  font-size: 0.8rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 1.65rem;
  color: #16243c;
}

.success-message {
  margin: 0;
  color: #4a5a72;
  line-height: 1.6;
  max-width: 340px;
}

.total-pill {
  padding: 10px 22px;
  border-radius: 999px;
  background: #fff8f2;
  color: #c2410c;
  font-size: 0.95rem;
}

.action-group {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 280px;
}

.solid-btn,
.ghost-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 24px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.solid-btn {
  border: 0;
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
}

.solid-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(255, 122, 21, 0.3);
}

.ghost-btn {
  border: 2px solid #d1d5db;
  background: transparent;
  color: #374151;
}

.ghost-btn:hover {
  border-color: #ff7a15;
  color: #c2410c;
  background: rgba(255, 122, 21, 0.06);
}

/* Checkmark animation */
.checkmark-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff8f2;
  margin-bottom: 4px;
}

.checkmark {
  width: 52px;
  height: 52px;
}

.checkmark-circle {
  stroke: #ff7a15;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke: #ff7a15;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.45s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@media (max-width: 500px) {
  .success-card {
    padding: 36px 20px;
  }

  h1 {
    font-size: 1.35rem;
  }
}
</style>
