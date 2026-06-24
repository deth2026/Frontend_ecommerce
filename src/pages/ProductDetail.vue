<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct } from '@/services/productService'
import { getProductReviews, createReview } from '@/services/reviewService'
import { toImageUrl } from '@/services/response'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const product = ref<any>(null)
const reviews = ref<any[]>([])
const loading = ref(false)
const reviewLoading = ref(false)
const error = ref('')
const reviewError = ref('')
const reviewForm = ref({
  rating: 5,
  comment: '',
})

const productId = computed(() => Number(route.params.id))

const loadProduct = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getProduct(productId.value)
    product.value = response.data
  } catch (err) {
    error.value = 'Product not found.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadReviews = async () => {
  try {
    const response = await getProductReviews(productId.value)
    reviews.value = response.data || []
  } catch (err) {
    console.error(err)
  }
}

const addToCart = async () => {
  if (!product.value) return
  try {
    await cartStore.addToCart(product.value)
  } catch (err: any) {
    if (err.response?.status === 401) {
      router.push('/login')
    }
  }
}

const toggleWishlist = async () => {
  if (!product.value) return
  try {
    await wishlistStore.toggleWishlist(product.value)
  } catch (err: any) {
    if (err.response?.status === 401) {
      router.push('/login')
    }
  }
}

const submitReview = async () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  reviewLoading.value = true
  reviewError.value = ''

  try {
    await createReview({
      product_id: productId.value,
      rating: Number(reviewForm.value.rating),
      comment: reviewForm.value.comment,
    })
    reviewForm.value.comment = ''
    reviewForm.value.rating = 5
    await loadReviews()
  } catch (err: any) {
    reviewError.value =
      err.response?.data?.message || 'Unable to submit your review right now.'
    console.error(err)
  } finally {
    reviewLoading.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    loadProduct()
    loadReviews()
  },
)

onMounted(async () => {
  await Promise.all([loadProduct(), loadReviews()])
})
</script>

<template>
  <main class="detail-page">
    <section v-if="loading" class="state">Loading product...</section>
    <section v-else-if="error" class="state state--error">{{ error }}</section>

    <section v-else-if="product" class="detail-shell">
      <div class="gallery">
        <img v-if="product.image" :src="toImageUrl(product.image)" :alt="product.name" />
        <div v-else class="placeholder">📦</div>
      </div>

      <div class="summary">
        <p class="eyebrow">{{ product.category?.name || 'Product' }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">${{ Number(product.price).toFixed(2) }}</p>
        <p class="description">
          {{ product.description || 'This product does not have a description yet.' }}
        </p>

        <div class="meta-grid">
          <div>
            <span>Stock</span>
            <strong>{{ product.stock ?? 'N/A' }}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>{{ product.category?.name || 'General' }}</strong>
          </div>
        </div>

        <div class="actions">
          <button type="button" class="solid-btn" @click="addToCart">Add to Cart</button>
          <button type="button" class="ghost-btn" @click="toggleWishlist">Wishlist</button>
        </div>
      </div>
    </section>

    <section v-if="product" class="reviews-shell">
      <div class="section-head">
        <div>
          <p class="eyebrow">Reviews</p>
          <h2>What shoppers say</h2>
        </div>
      </div>

      <form class="review-form" @submit.prevent="submitReview">
        <label>
          Rating
          <select v-model="reviewForm.rating">
            <option :value="5">5 - Excellent</option>
            <option :value="4">4 - Good</option>
            <option :value="3">3 - Average</option>
            <option :value="2">2 - Fair</option>
            <option :value="1">1 - Poor</option>
          </select>
        </label>

        <label class="comment-field">
          Comment
          <textarea
            v-model="reviewForm.comment"
            rows="4"
            placeholder="Share your experience..."
          />
        </label>

        <div class="review-actions">
          <p v-if="reviewError" class="state state--error">{{ reviewError }}</p>
          <button type="submit" class="solid-btn" :disabled="reviewLoading">
            {{ reviewLoading ? 'Submitting...' : 'Post Review' }}
          </button>
        </div>
      </form>

      <div v-if="reviews.length" class="review-grid">
        <article v-for="review in reviews" :key="review.id" class="review-card">
          <strong>{{ review.user?.name || 'Customer' }}</strong>
          <p class="stars">Rating: {{ review.rating }}/5</p>
          <p>{{ review.comment }}</p>
        </article>
      </div>
      <p v-else class="state">No reviews yet.</p>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

.detail-page {
  min-height: 100vh;
  padding: 32px 24px 72px;
  background: linear-gradient(180deg, #fff8f2 0%, #fffdf9 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.detail-shell,
.reviews-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.gallery,
.summary,
.review-form,
.review-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 122, 21, 0.1);
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(18, 32, 51, 0.06);
}

.gallery {
  min-height: 520px;
  overflow: hidden;
}

.gallery img,
.placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  display: grid;
  place-items: center;
  font-size: 4rem;
  color: #b7c0cf;
}

.summary {
  padding: 30px;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #ff7a15;
  font-size: 0.8rem;
  font-weight: 700;
}

.summary h1,
.section-head h2 {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #16243c;
}

.summary h1 {
  font-size: clamp(2rem, 3vw, 3rem);
}

.price {
  margin: 14px 0;
  color: #16243c;
  font-size: 1.8rem;
  font-weight: 800;
}

.description {
  color: #5f6d82;
  line-height: 1.7;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 26px 0;
}

.meta-grid div {
  padding: 16px;
  border-radius: 20px;
  background: #fff7ef;
}

.meta-grid span {
  display: block;
  font-size: 0.82rem;
  color: #7a8798;
  margin-bottom: 6px;
}

.meta-grid strong {
  color: #16243c;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.solid-btn,
.ghost-btn {
  min-height: 48px;
  padding: 0 20px;
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

.reviews-shell {
  margin-top: 32px;
}

.section-head {
  margin-bottom: 18px;
}

.review-form {
  padding: 24px;
  display: grid;
  gap: 16px;
}

.review-form label {
  display: grid;
  gap: 8px;
  color: #425166;
  font-weight: 600;
}

.review-form select,
.review-form textarea {
  width: 100%;
  border: 2px solid #ffd3aa;
  border-radius: 18px;
  padding: 14px 16px;
  font: inherit;
  background: #fff;
}

.review-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.review-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.review-card {
  padding: 18px;
}

.review-card p {
  margin: 8px 0 0;
  color: #5f6d82;
}

.stars {
  color: #ff7a15;
  font-weight: 700;
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
  .detail-shell {
    grid-template-columns: 1fr;
  }
}
</style>
