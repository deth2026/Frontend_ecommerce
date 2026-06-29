<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { checkout } from '@/services/checkout'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const error = ref('')
const form = ref({
  name: '',
  email: '',
  shipping_address: '',
  phone: '',
  notes: '',
  payment_method: 'cod',
})

const subtotal = computed(() => cartStore.totalPrice)
const hasUnavailableItems = computed(() =>
  cartStore.items.some((item) => cartStore.isOutOfStock(item.product)),
)
const canCheckout = computed(() => !!cartStore.items.length && !hasUnavailableItems.value)

onMounted(() => {
  cartStore.loadCart().catch(() => undefined)
})

const submitCheckout = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await checkout({
      name: form.value.name,
      email: form.value.email,
      shipping_address: form.value.shipping_address,
      address: form.value.shipping_address,
      phone: form.value.phone,
      notes: form.value.notes,
      payment_method: form.value.payment_method,
    })

    cartStore.items = []

    const orderId = response?.data?.id
    const orderTotal = response?.data?.total_amount ?? response?.data?.total ?? subtotal.value

    router.push({
      path: '/order-success',
      query: { order_id: orderId, total: orderTotal },
    })
  } catch (err: any) {
    if (err.response?.status === 401) {
      router.push('/login')
      return
    }

    error.value =
      err.response?.data?.message ||
      (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : '') ||
      'Checkout failed.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="checkout-page">
    <section class="checkout-shell">
      <div class="page-head">
        <p class="eyebrow">Checkout</p>
        <h1>Complete your order</h1>
      </div>

      <div v-if="error" class="state state--error">{{ error }}</div>

      <div class="checkout-grid">
        <form class="checkout-card" @submit.prevent="submitCheckout">
          <h2>Shipping details</h2>
          <div v-if="!cartStore.items.length" class="state state--error">
            Your cart is empty. Add products before checkout.
          </div>
          <div v-else-if="hasUnavailableItems" class="state state--error">
            Some items in your cart are out of stock. Please remove them before checkout.
          </div>
          <label>
            Full name
            <input v-model="form.name" type="text" required placeholder="Full name" />
          </label>
          <label>
            Email address
            <input v-model="form.email" type="email" required placeholder="Email address" />
          </label>
          <label>
            Shipping address
            <textarea v-model="form.shipping_address" rows="4" required placeholder="Enter delivery address" />
          </label>
          <label>
            Phone number
            <input v-model="form.phone" type="tel" required placeholder="Phone number" />
          </label>
          <label>
            Notes
            <textarea v-model="form.notes" rows="3" placeholder="Optional notes for the driver" />
          </label>
          <label>
            Payment method
            <select v-model="form.payment_method">
              <option value="cod">Cash on delivery</option>
            </select>
          </label>
          <button type="submit" class="solid-btn" :disabled="loading || !canCheckout">
            {{ loading ? 'Placing Order...' : 'Place Order' }}
          </button>
        </form>

        <aside class="summary-card">
          <h2>Order summary</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>${{ subtotal.toFixed(2) }}</strong>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <strong>Calculated by backend</strong>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <strong>${{ subtotal.toFixed(2) }}</strong>
          </div>
          <p class="helper">
            Your backend will determine the final total during checkout based on the stored cart.
          </p>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.checkout-page {
  min-height: 100vh;
  padding: 32px 24px 72px;
  background: linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.checkout-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.page-head h1,
.checkout-card h2,
.summary-card h2 {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #16243c;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #ff7a15;
  font-size: 0.8rem;
  font-weight: 700;
}

.checkout-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 22px;
}

.checkout-card,
.summary-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 122, 21, 0.1);
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(18, 32, 51, 0.06);
  padding: 24px;
  display: grid;
  gap: 16px;
}

.checkout-card label {
  display: grid;
  gap: 8px;
  color: #425166;
  font-weight: 600;
}

.checkout-card input,
.checkout-card textarea {
  width: 100%;
  border: 2px solid #ffd3aa;
  border-radius: 18px;
  padding: 14px 16px;
  font: inherit;
  background: #fff;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #627085;
}

.summary-row.total {
  font-size: 1.08rem;
  color: #16243c;
}

.helper {
  margin: 0;
  color: #7b8798;
  line-height: 1.6;
}

.solid-btn {
  min-height: 50px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.state {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #fff0f0;
}

.state--error {
  color: #dc2626;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
