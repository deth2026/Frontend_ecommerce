<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">✨ New Collection 2026 ✨</div>
        <h1 class="hero-title">Welcome to Your Happy Place</h1>
        <p class="hero-text">
          Beautiful, comfortable pieces that make everyday life feel special. Thoughtfully chosen
          with love and care.
        </p>

        <div class="hero-actions">
          <router-link to="/products" class="btn btn-primary"> Shop Now </router-link>
          <router-link to="/products" class="btn btn-secondary"> Browse Everything </router-link>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories-section">
      <div class="categories-shell">
        <div class="categories-copy">
          <p class="section-eyebrow">Shop smart</p>
          <h2 class="section-title section-title--left">Discover products made for everyday joy</h2>
          <p class="categories-text">
            Find beautiful picks for home, beauty, and gifting in one place. Curated to feel warm,
            simple, and easy to shop.
          </p>
          <router-link to="/products" class="categories-link">Explore all products</router-link>
        </div>

        <div class="shopping-visual">
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
            alt="People shopping with bags in a modern store"
          />
          <div class="shopping-visual__label">
            <strong>Shopping made simple</strong>
            <span>Fresh finds and easy checkout</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TRENDING PRODUCTS -->
    <section class="products-section">
      <div class="section-container">
        <div class="section-head">
          <div>
            <h2 class="section-title">Trending Right Now</h2>
            <p class="section-subtitle">Loved by many, just like you</p>
          </div>
          <router-link to="/products" class="link-more">See all →</router-link>
        </div>

        <div v-if="productsLoading" class="loading-state">Loading lovely products...</div>
        <p v-else-if="productsError" class="error-state">{{ productsError }}</p>

        <div v-else class="products-grid">
          <div
            v-for="product in products.slice(0, 8)"
            :key="product.id"
            class="product-card"
            :class="{ 'product-card--disabled': isOutOfStock(product) }"
          >
            <div class="card-media">
              <img
                v-if="product.image"
                :src="toImageUrl(product.image)"
                :alt="product.name"
                class="product-img"
                loading="lazy"
              />
              <div v-else class="placeholder">📸</div>
              <span v-if="isOutOfStock(product)" class="out-of-stock">Out of stock</span>
              <span v-else-if="isLowStock(product)" class="low-stock">
                Only a few left!
              </span>
            </div>

            <div class="card-body">
              <p class="card-category">{{ product.category?.name || 'Special' }}</p>
              <h3 class="card-title">{{ product.name }}</h3>

              <div class="card-footer">
                <span class="card-price">${{ product.price }}</span>
                <button
                  @click="addToCart(product)"
                  class="btn-add-to-cart"
                  :disabled="isOutOfStock(product)"
                >
                  {{ isOutOfStock(product) ? 'Out of Stock' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS WITH ICONS -->
    <section class="benefits-section">
      <div class="benefits-shell">
        <div class="benefits-copy">
          <p class="section-eyebrow">Why shop with us</p>
          <h2 class="section-title section-title--left">Simple perks, better shopping</h2>
          <p class="benefits-text">
            Every order comes with a little extra care, from fast delivery to secure checkout and
            easy returns.
          </p>
        </div>

        <div class="benefits-grid">
          <div class="benefit">
            <div class="benefit-icon">🚚</div>
            <div class="benefit-content">
              <h4>Free Shipping</h4>
              <p>On orders over $100</p>
            </div>
          </div>

          <div class="benefit">
            <div class="benefit-icon">🔄</div>
            <div class="benefit-content">
              <h4>Hassle-Free Returns</h4>
              <p>30 days easy returns</p>
            </div>
          </div>

          <div class="benefit">
            <div class="benefit-icon">⭐</div>
            <div class="benefit-content">
              <h4>Premium Quality</h4>
              <p>Made with love & care</p>
            </div>
          </div>

          <div class="benefit">
            <div class="benefit-icon">🔒</div>
            <div class="benefit-content">
              <h4>Secure Shopping</h4>
              <p>Safe & protected checkout</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter-section">
      <div class="newsletter-shell">
        <div class="newsletter-card">
          <div class="promo-badge">Limited offer</div>
          <div class="newsletter-copy">
            <p class="section-eyebrow">Promotion</p>
            <h2>Save 10% off on Black friday </h2>
            <p>
              Join now and unlock a welcome discount, early product drops, and exclusive member
              deals.
            </p>
            <div class="promo-points">
              <span>15% off first purchase</span>
              <span>Exclusive offers</span>
              <span>Early access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProducts } from '@/services/productService'
import { toImageUrl } from '@/services/response'
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notifications'

const cartStore = useCartStore()
const notifications = useNotificationStore()

// Products
const products = ref<any[]>([])
const productsLoading = ref(false)
const productsError = ref('')

const fetchProducts = async () => {
  try {
    productsLoading.value = true
    const res = await getProducts()
    products.value = res.data || []
  } catch (err) {
    productsError.value = 'Failed to load products. Please try again.'
    console.error(err)
  } finally {
    productsLoading.value = false
  }
}

const addToCart = (product: any) => {
  cartStore.addToCart(product).catch((err: any) => {
    if (err.response?.status === 401) {
      window.location.href = '/login'
      return
    }

    notifications.error(err?.message || 'Unable to add this product to your cart.')
  })
}

const isOutOfStock = (product: any) => cartStore.isOutOfStock(product)
const isLowStock = (product: any) => {
  const stock = cartStore.getProductStock(product)
  return stock !== null && stock > 0 && stock < 5
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.home {
  font-family: 'Inter', system-ui, sans-serif;
}

.hero {
  background: linear-gradient(135deg, #fff7ed 0%, #fef3e8 100%);
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('https://picsum.photos/id/1015/2000/1200') center/cover;
  opacity: 0.12;
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  padding: 0 24px;
  z-index: 2;
}

.hero-badge {
  background: #ffedd5;
  color: #c2410c;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 9999px;
  display: inline-block;
  margin-bottom: 20px;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2.8rem, 7vw, 4.8rem);
  line-height: 1.1;
  font-weight: 700;
  color: #1e2937;
  margin-bottom: 20px;
}

.hero-text {
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto 40px;
}

.btn {
  padding: 16px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1.05rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #f97316;
  color: white;
}

.btn-primary:hover {
  background: #ea580c;
  transform: translateY(-3px);
}

.btn-secondary {
  background: white;
  color: #1e2937;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #f97316;
  color: #f97316;
}

/* CATEGORIES */
.categories-section {
  padding: 88px 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 122, 21, 0.12), transparent 24%),
    linear-gradient(180deg, #fffdfb 0%, #fff7ef 100%);
}

.categories-shell {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e2937;
  margin-bottom: 40px;
}

.section-title--left {
  text-align: left;
  margin-bottom: 14px;
}

.section-eyebrow {
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #f97316;
  font-size: 0.8rem;
  font-weight: 800;
}

.categories-copy {
  padding-right: 16px;
}

.categories-text {
  margin: 0 0 22px;
  max-width: 420px;
  color: #64748b;
  line-height: 1.8;
}

.categories-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 12px 24px rgba(249, 115, 22, 0.22);
}

.shopping-visual {
  position: relative;
  min-height: 340px;
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(249, 115, 22, 0.12);
  box-shadow: 0 18px 42px rgba(18, 32, 51, 0.08);
  background: linear-gradient(135deg, #fffdf9 0%, #fff3e9 100%);
}

.shopping-visual img {
  width: 100%;
  height: 100%;
  min-height: 340px;
  object-fit: cover;
  display: block;
}

.shopping-visual__label {
  position: absolute;
  left: 18px;
  bottom: 18px;
  right: 18px;
  display: grid;
  gap: 4px;
  padding: 16px 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #16243c;
  box-shadow: 0 10px 24px rgba(18, 32, 51, 0.08);
}

.shopping-visual__label strong {
  font-size: 1rem;
}

.shopping-visual__label span {
  color: #64748b;
  font-size: 0.92rem;
}

/* PRODUCTS */
.products-section {
  padding: 90px 24px;
  background: #fffaf0;
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 50px;
}

.section-subtitle {
  color: #64748b;
}

.link-more {
  color: #f97316;
  font-weight: 600;
  text-decoration: none;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.product-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
}

.product-card--disabled {
  opacity: 0.72;
  filter: grayscale(0.35);
}

.product-card--disabled:hover {
  transform: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.product-card--disabled .product-img,
.product-card--disabled .placeholder {
  filter: grayscale(1);
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px rgba(249, 115, 22, 0.18);
}

.card-media {
  height: clamp(200px, 24vw, 240px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.6s ease;
}

.product-card:hover .product-img {
  transform: scale(1.08);
}

.low-stock {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f97316;
  color: white;
  font-size: 0.75rem;
  padding: 6px 14px;
  border-radius: 9999px;
  font-weight: 600;
}

.out-of-stock {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #64748b;
  color: white;
  font-size: 0.75rem;
  padding: 6px 14px;
  border-radius: 9999px;
  font-weight: 600;
}

.card-body {
  padding: 18px 22px 20px;
}

.card-category {
  color: #f97316;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 1.2rem;
  line-height: 1.35;
  margin: 8px 0 10px;
  color: #1e2937;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e2937;
}

.btn-add-to-cart {
  background: #f97316;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-to-cart:hover {
  background: #ea580c;
  transform: translateY(-2px);
}

.btn-add-to-cart:disabled {
  background: #c9d2df;
  cursor: not-allowed;
  transform: none;
}

/* BENEFITS WITH ICONS */
.benefits-section {
  padding: 92px 24px;
  background:
    radial-gradient(circle at top right, rgba(255, 122, 21, 0.1), transparent 26%),
    linear-gradient(180deg, #fff7ed 0%, #fffdf9 100%);
}

.benefits-shell {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 28px;
  align-items: start;
}

.benefits-copy {
  position: sticky;
  top: 28px;
}

.benefits-text {
  margin: 0;
  max-width: 420px;
  color: #64748b;
  line-height: 1.8;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 247, 240, 0.98));
  padding: 24px 22px;
  border-radius: 24px;
  box-shadow: 0 14px 36px rgba(18, 32, 51, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 122, 21, 0.08);
}

.benefit:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(249, 115, 22, 0.15);
}

.benefit-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff1e6;
  border-radius: 18px;
  font-size: 2rem;
}

.benefit-content h4 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: #1e2937;
}

.benefit-content p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}

/* NEWSLETTER */
.newsletter-section {
  padding: 0 24px 100px;
  background: #fffdf9;
}

.newsletter-shell {
  max-width: 1280px;
  margin: 0 auto;
}

.newsletter-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 34px 36px;
  border-radius: 32px;
  background:
    radial-gradient(circle at top right, rgba(249, 115, 22, 0.16), transparent 26%),
    linear-gradient(135deg, #fff5eb 0%, #fffdf9 100%);
  border: 1px solid rgba(255, 122, 21, 0.14);
  box-shadow: 0 20px 48px rgba(18, 32, 51, 0.07);
  position: relative;
  overflow: hidden;
}

.newsletter-card::after {
  content: '';
  position: absolute;
  inset: auto -80px -80px auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.08);
  pointer-events: none;
}

.promo-badge {
  grid-column: 1 / -1;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ffedd5;
  color: #c2410c;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.newsletter-copy h2 {
  font-size: clamp(2rem, 3vw, 3rem);
  margin: 0 0 10px;
  color: #1e2937;
}

.newsletter-copy p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}

.promo-points {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.promo-points span {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 122, 21, 0.14);
  color: #16243c;
  font-size: 0.88rem;
  font-weight: 600;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-self: end;
}

.newsletter-form input {
  min-width: min(100%, 340px);
  padding: 16px 20px;
  border: 2px solid #fed7aa;
  border-radius: 9999px;
  font-size: 1.05rem;
  background: rgba(255, 255, 255, 0.92);
}

.newsletter-form button {
  min-width: 140px;
  padding: 0 28px;
  background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
  color: #fff;
}

.newsletter-form button:hover {
  background: #ea580c;
}

/* States */
.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.1rem;
  color: #64748b;
}

.error-state {
  color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .categories-shell {
    grid-template-columns: 1fr;
  }

  .benefits-shell {
    grid-template-columns: 1fr;
  }

  .benefits-copy {
    position: static;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .newsletter-card {
    grid-template-columns: 1fr;
  }

  .promo-badge {
    grid-column: auto;
  }

  .newsletter-form {
    justify-self: stretch;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-text {
    font-size: 1rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-form input,
  .newsletter-form button {
    width: 100%;
    min-width: 0;
  }
}
</style>
