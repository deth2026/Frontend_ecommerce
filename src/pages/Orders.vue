<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getOrders } from '@/services/orderService'

const orders = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getOrders()
    orders.value = response.data || []
  } catch (err) {
    error.value = 'Failed to load orders.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'N/A'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

const getOrderItems = (order: any) => {
  return order?.items || order?.order_items || order?.line_items || order?.orderItems || []
}

const getOrderItemCount = (order: any) => {
  const items = getOrderItems(order)

  if (Array.isArray(items) && items.length) {
    return items.reduce((sum, item) => sum + Number(item?.quantity || 1), 0)
  }

  return Number(order?.items_count ?? order?.total_items ?? order?.item_count ?? order?.count) || 0
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <main class="orders-page">
    <section class="orders-shell">
      <div class="page-head">
        <p class="eyebrow">Order history</p>
        <h1>Your recent orders</h1>
      </div>

      <p v-if="loading" class="state">Loading orders...</p>
      <p v-else-if="error" class="state state--error">{{ error }}</p>
      <div v-else-if="!orders.length" class="empty-state">
        <h2>No orders yet</h2>
        <p>Your completed checkouts will show up here.</p>
        <router-link to="/products" class="solid-btn">Start Shopping</router-link>
      </div>

      <div v-else class="order-grid">
        <article v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-top">
            <div>
              <p class="eyebrow">Order #{{ order.id }}</p>
              <h2>${{ Number(order.total_amount ?? order.total ?? order.amount ?? 0).toFixed(2) }}</h2>
            </div>
            <span class="status">{{ order.status || 'pending' }}</span>
          </div>

          <div class="order-meta">
            <span>Placed: {{ formatDate(order.created_at) }}</span>
            <span>Items: {{ getOrderItemCount(order) }}</span>
          </div>

          <div class="item-list" v-if="getOrderItems(order).length">
            <p v-for="item in getOrderItems(order)" :key="item.id">
              {{ item.product?.name || item.name || `Product #${item.product_id || item.id}` }}
              <strong>x{{ item.quantity || 1 }}</strong>
            </p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.orders-page {
  min-height: 100vh;
  padding: 32px 24px 72px;
  background: linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.orders-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.page-head h1,
.order-card h2,
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

.order-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.order-card,
.empty-state {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 122, 21, 0.1);
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(18, 32, 51, 0.06);
  padding: 24px;
}

.order-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.status {
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff0e1;
  color: #ff7a15;
  font-weight: 700;
  text-transform: capitalize;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 14px 0;
  color: #6b768a;
  font-size: 0.94rem;
  flex-wrap: wrap;
}

.item-list {
  display: grid;
  gap: 10px;
  color: #16243c;
}

.item-list p {
  margin: 0;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px;
  background: #fff8ef;
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

.solid-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  border: 0;
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}
</style>
