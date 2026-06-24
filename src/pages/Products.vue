<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategories } from '@/services/categoryService'
import { getProducts, getProductsByCategory, searchProducts } from '@/services/productService'
import { toImageUrl } from '@/services/response'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const categories = ref<any[]>([])
const products = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref(String(route.query.q || ''))
const selectedCategory = ref<number | null>(
  route.query.category ? Number(route.query.category) : null,
)
const debounceTimer = ref<number | null>(null)

const activeCategoryName = computed(() => {
  if (!selectedCategory.value) return 'All Products'
  return categories.value.find((category) => Number(category.id) === Number(selectedCategory.value))?.name || 'Category'
})

const normalizeProducts = (items: any[]) => {
  return items.map((item) => ({
    ...item,
    imageUrl: toImageUrl(item.image),
    categoryName: item.category?.name || item.category_name || 'General',
  }))
}

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.data || []
  } catch (err) {
    console.error(err)
  }
}

const fetchProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    const query = searchQuery.value.trim()

    let response
    if (query) {
      response = await searchProducts(query)
      products.value = normalizeProducts(response.data || [])
    } else if (selectedCategory.value) {
      response = await getProductsByCategory(selectedCategory.value)
      products.value = normalizeProducts(response.data || [])
    } else {
      response = await getProducts()
      products.value = normalizeProducts(response.data || [])
    }
  } catch (err) {
    error.value = 'Failed to load products.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const selectCategory = (categoryId: number | null) => {
  selectedCategory.value = categoryId
  router.replace({
    query: {
      ...route.query,
      category: categoryId ? String(categoryId) : undefined,
    },
  })
}

const addItemToCart = async (product: any) => {
  try {
    await cartStore.addToCart(product)
  } catch (err: any) {
    if (err.response?.status === 401) {
      router.push('/login')
    }
  }
}

const toggleWishlist = async (product: any) => {
  try {
    await wishlistStore.toggleWishlist(product)
  } catch (err: any) {
    if (err.response?.status === 401) {
      router.push('/login')
    }
  }
}

watch(searchQuery, () => {
  if (debounceTimer.value) {
    window.clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = window.setTimeout(() => {
    fetchProducts()
  }, 300)
})

watch(selectedCategory, () => {
  fetchProducts()
})

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProducts()])
})
</script>

<template>
  <main class="products-page">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Browse the collection</p>
        <h1 style="color: #ff7a15;">Find The Products</h1>
        <p>
          Search products, filter by category, and add items to your wishlist or cart in one
          place.
        </p>
      </div>

      <div class="hero-panel">
        <label class="search-box">
          <span>Search</span>
          <input v-model="searchQuery" type="search" placeholder="Search products..." />
        </label>
      </div>
    </section>

    <section class="filters">
      <button
        type="button"
        class="chip"
        :class="{ active: !selectedCategory }"
        @click="selectCategory(null)"
      >
        All
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="chip"
        :class="{ active: Number(selectedCategory) === Number(category.id) }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </section>

    <section class="content-shell">
      <div class="section-head">
        <div>
          <p class="section-label">Products</p>
          <h2>{{ activeCategoryName }}</h2>
        </div>
        <p class="result-count">{{ products.length }} items</p>
      </div>

      <p v-if="loading" class="state">Loading products...</p>
      <p v-else-if="error" class="state state--error">{{ error }}</p>

      <div v-else class="product-grid">
        <article v-for="product in products" :key="product.id" class="product-card">
          <router-link :to="`/products/${product.id}`" class="product-link">
            <div class="product-media">
              <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" />
              <div v-else class="placeholder">📦</div>
            </div>

            <div class="product-body">
              <p class="category">{{ product.categoryName }}</p>
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description || 'No description available.' }}</p>
              <div class="price-row">
                <strong>${{ Number(product.price).toFixed(2) }}</strong>
                <span v-if="product.stock !== undefined">Stock: {{ product.stock }}</span>
              </div>
            </div>
          </router-link>

          <div class="card-actions">
            <button
              type="button"
              class="ghost-btn wishlist-btn"
              :class="{ active: wishlistStore.isInWishlist(product.id) }"
              :aria-label="
                wishlistStore.isInWishlist(product.id)
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              "
              @click="toggleWishlist(product)"
            >
              <span aria-hidden="true">
                {{ wishlistStore.isInWishlist(product.id) ? '♥' : '♡' }}
              </span>
            </button>
            <button type="button" class="solid-btn" @click="addItemToCart(product)">
              Add to Cart
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.products-page {
  min-height: 100vh;
  padding: 32px 24px 72px;
  background:
    radial-gradient(circle at top right, rgba(255, 163, 96, 0.14), transparent 30%),
    linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.hero,
.content-shell {
  max-width: 1280px;
  margin: 0 auto;
}

.hero {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
  align-items: end;
  margin-bottom: 22px;
}

.hero-copy {
  padding: 28px 0;
}

.eyebrow,
.section-label,
.category {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #ff7a15;
  font-size: 0.8rem;
  font-weight: 700;
}

.hero-copy h1 {
  margin: 0 0 12px;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1.05;
  color: #16243c;
}

.hero-copy p {
  margin: 0;
  max-width: 720px;
  color: #5f6d82;
  font-size: 1.05rem;
  line-height: 1.7;
}

.hero-panel {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 122, 21, 0.12);
  border-radius: 28px;
  padding: 22px;
  box-shadow: 0 18px 44px rgba(18, 32, 51, 0.06);
}

.search-box {
  display: grid;
  gap: 10px;
  color: #5f6d82;
  font-size: 0.95rem;
  font-weight: 600;
}

.search-box input {
  width: 100%;
  min-height: 58px;
  padding: 0 18px;
  border: 2px solid #ffd3aa;
  border-radius: 18px;
  background: #fff;
  font-size: 1rem;
  outline: none;
}

.search-box input:focus {
  border-color: #ff7a15;
  box-shadow: 0 0 0 4px rgba(255, 122, 21, 0.12);
}

.filters {
  max-width: 1280px;
  margin: 0 auto 24px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chip {
  border: 1px solid rgba(255, 122, 21, 0.16);
  background: rgba(255, 255, 255, 0.92);
  color: #5b687d;
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.chip.active {
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  border-color: transparent;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-head h2 {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.4rem, 2vw, 2.2rem);
  color: #16243c;
}

.result-count {
  margin: 0;
  color: #7b8798;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 22px;
}

.product-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 122, 21, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(18, 32, 51, 0.06);
}

.product-link {
  color: inherit;
  text-decoration: none;
}

.product-media {
  width: 100%;
  height: clamp(180px, 18vw, 220px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.placeholder {
  display: grid;
  place-items: center;
  font-size: 2.4rem;
  color: #b4bdca;
}

.product-body {
  padding: 16px 18px 6px;
}

.product-body h3 {
  margin: 0 0 8px;
  color: #16243c;
  font-size: 1.08rem;
}

.description {
  margin: 0 0 10px;
  color: #6b768a;
  font-size: 0.92rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 0;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #16243c;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 12px 18px 16px;
}

.ghost-btn,
.solid-btn {
  min-height: 44px;
  border-radius: 999px;
  border: 0;
  font-weight: 700;
  cursor: pointer;
}

.ghost-btn {
  background: rgba(255, 122, 21, 0.08);
  color: #ff7a15;
}

.wishlist-btn {
  display: grid;
  place-items: center;
  font-size: 1.15rem;
  line-height: 1;
}

.wishlist-btn.active {
  background: rgba(255, 122, 21, 0.16);
}

.solid-btn {
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  box-shadow: 0 10px 18px rgba(255, 122, 21, 0.22);
}

.state {
  padding: 56px 20px;
  text-align: center;
  color: #627085;
}

.state--error {
  color: #dc2626;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .products-page {
    padding: 22px 16px 56px;
  }

  .card-actions {
    grid-template-columns: 1fr;
  }
}
</style>
