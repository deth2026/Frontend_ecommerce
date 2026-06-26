<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notifications'
import { toImageUrl } from '@/services/response'

const router = useRouter()
const cartStore = useCartStore()
const notifications = useNotificationStore()

onMounted(() => {
  cartStore.loadCart().catch(() => undefined)
})

const goToCheckout = () => {
  router.push('/checkout')
}

const isOutOfStock = (item: any) => cartStore.isOutOfStock(item.product)

const handleQuantityChange = async (item: any, event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)

  try {
    await cartStore.updateQuantity(item.id, value)
  } catch (err: any) {
    if (err.response?.status === 401) {
      router.push('/login')
      return
    }

    notifications.error(err?.message || 'Unable to update cart quantity.')
  }
}
</script>

<template>
  <main class="cart-page">
    <section class="cart-shell">
      <div class="page-head">
        <div>
          <p class="eyebrow">Your cart</p>
          <h1>Review your items before checkout</h1>
        </div>
      </div>

      <p v-if="cartStore.loading" class="state">Loading cart...</p>
      <p v-else-if="cartStore.error" class="state state--error">{{ cartStore.error }}</p>
      <div v-else-if="!cartStore.items.length" class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Go back to products and add something beautiful.</p>
        <router-link to="/products" class="solid-btn">Browse Products</router-link>
      </div>

      <div v-else class="cart-grid">
        <div class="items-list">
          <article v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img v-if="item.product?.image" :src="toImageUrl(item.product.image)" :alt="item.product?.name" />
            <div v-else class="placeholder">📦</div>

            <div class="item-copy">
              <h3>{{ item.product?.name || 'Cart item' }}</h3>
              <p>{{ item.product?.category?.name || 'General' }}</p>
              <strong>${{ Number(item.price).toFixed(2) }}</strong>
            </div>

            <div class="item-actions">
              <label>
                Qty
                <input
                  type="number"
                  min="1"
                  :max="cartStore.getProductStock(item.product) ?? undefined"
                  :disabled="isOutOfStock(item)"
                  :value="item.quantity"
                  @change="handleQuantityChange(item, $event)"
                />
              </label>
              <p v-if="isOutOfStock(item)" class="stock-note">This item is out of stock.</p>
              <button type="button" class="ghost-btn" @click="cartStore.removeFromCart(item.id)">
                Remove
              </button>
            </div>
          </article>
        </div>

        <aside class="summary-card">
          <p class="eyebrow">Summary</p>
          <h2>Order total</h2>
          <div class="summary-row">
            <span>Items</span>
            <strong>{{ cartStore.totalItems }}</strong>
          </div>
          <div class="summary-row">
            <span>Total</span>
            <strong>${{ cartStore.totalPrice.toFixed(2) }}</strong>
          </div>
          <button type="button" class="solid-btn" @click="goToCheckout">Proceed to Checkout</button>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.cart-page {
  min-height: 100vh;
  padding: 32px 24px 72px;
  background: linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.cart-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.page-head h1,
.summary-card h2,
.empty-state h2 {
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

.page-head {
  margin-bottom: 24px;
}

.cart-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 22px;
  align-items: start;
}

.items-list,
.summary-card,
.empty-state {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 122, 21, 0.1);
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(18, 32, 51, 0.06);
}

.items-list {
  padding: 18px;
  display: grid;
  gap: 14px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 14px;
  border-radius: 22px;
  background: #fff8ef;
}

.cart-item img,
.placeholder {
  width: 100px;
  height: 100px;
  border-radius: 18px;
  object-fit: cover;
  background: #fff;
}

.placeholder {
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #b7c0cf;
}

.item-copy h3 {
  margin: 0 0 8px;
  color: #16243c;
}

.item-copy p,
.item-copy strong {
  margin: 0;
  color: #617084;
}

.item-copy strong {
  display: inline-block;
  margin-top: 8px;
  color: #16243c;
}

.item-actions {
  display: grid;
  gap: 10px;
  justify-items: end;
}

.item-actions label {
  display: grid;
  gap: 6px;
  color: #5f6d82;
  font-size: 0.9rem;
  font-weight: 600;
}

.item-actions input {
  width: 86px;
  min-height: 42px;
  border: 2px solid #ffd3aa;
  border-radius: 14px;
  padding: 0 12px;
}

.item-actions input:disabled {
  background: #eef2f7;
  color: #94a3b8;
  cursor: not-allowed;
}

.stock-note {
  margin: 0;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
}

.solid-btn,
.ghost-btn {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 0;
  font-weight: 700;
  cursor: pointer;
}

.solid-btn {
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
}

.ghost-btn {
  background: rgba(255, 122, 21, 0.08);
  color: #ff7a15;
}

.summary-card {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #627085;
}

.summary-row strong {
  color: #16243c;
}

.empty-state,
.state {
  padding: 56px 20px;
  text-align: center;
}

.empty-state {
  display: grid;
  gap: 10px;
}

.state {
  color: #627085;
}

.state--error {
  color: #dc2626;
}

@media (max-width: 900px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-actions {
    justify-items: start;
  }
}
</style>
