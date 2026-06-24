<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { toImageUrl } from '@/services/response'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

onMounted(() => {
  wishlistStore.loadWishlist().catch(() => undefined)
})

const addToCart = async (product: any) => {
  await cartStore.addToCart(product)
}
</script>

<template>
  <main class="wishlist-page">
    <section class="wishlist-shell">
      <div class="page-head">
        <p class="eyebrow">Wishlist</p>
        <h1>Saved for later</h1>
      </div>

      <p v-if="wishlistStore.loading" class="state">Loading wishlist...</p>
      <p v-else-if="wishlistStore.error" class="state state--error">{{ wishlistStore.error }}</p>
      <div v-else-if="!wishlistStore.items.length" class="empty-state">
        <h2>No saved items yet</h2>
        <p>Add products you like and come back anytime.</p>
        <router-link to="/products" class="solid-btn">Browse Products</router-link>
      </div>

      <div v-else class="wishlist-grid">
        <article v-for="item in wishlistStore.items" :key="item.id" class="wishlist-card">
          <img v-if="item.image" :src="toImageUrl(item.image)" :alt="item.name" />
          <div v-else class="placeholder">💗</div>

          <div class="copy">
            <p class="category">{{ item.category?.name || 'General' }}</p>
            <h2>{{ item.name }}</h2>
            <p class="price">${{ Number(item.price || 0).toFixed(2) }}</p>
          </div>

          <div class="actions">
            <button
              type="button"
              class="ghost-btn"
              @click="wishlistStore.removeFromWishlist(item.id)"
            >
              Remove
            </button>
            <button type="button" class="solid-btn" @click="addToCart(item)">Add to Cart</button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.wishlist-page {
  min-height: 100vh;
  padding: 32px 24px 72px;
  background: linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.wishlist-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.page-head h1,
.wishlist-card h2,
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

.wishlist-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.wishlist-card,
.empty-state {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 122, 21, 0.1);
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(18, 32, 51, 0.06);
  padding: 18px;
}

.wishlist-card img,
.placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 22px;
  background: #fff8ef;
}

.placeholder {
  display: grid;
  place-items: center;
  font-size: 3rem;
  color: #b7c0cf;
}

.copy {
  padding: 16px 4px 0;
}

.category,
.price {
  margin: 0;
}

.category {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #ff7a15;
  font-size: 0.78rem;
  font-weight: 700;
}

.price {
  margin-top: 10px;
  font-weight: 800;
  color: #16243c;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.solid-btn,
.ghost-btn {
  min-height: 46px;
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

@media (max-width: 640px) {
  .actions {
    grid-template-columns: 1fr;
  }
}
</style>
