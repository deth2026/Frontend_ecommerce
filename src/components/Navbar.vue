<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { getUser, logoutUser } from '@/services/authService'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const { totalItems: cartItems } = storeToRefs(cartStore)
const { totalItems: wishlistItems } = storeToRefs(wishlistStore)

const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')
const isAuthenticated = computed(() => auth.isAuthenticated)
const showAccountMenu = ref(false)
const showLogoutConfirm = ref(false)

const userInitial = computed(() => {
  const name = auth.user?.name || auth.user?.full_name || auth.user?.email || 'U'
  return String(name).charAt(0).toUpperCase()
})

const displayName = computed(() => auth.user?.name || auth.user?.full_name || 'Profile')

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value
}

const closeAccountMenu = () => {
  showAccountMenu.value = false
}

const loadCurrentUser = async () => {
  if (!auth.isAuthenticated || auth.user) return

  try {
    const response = await getUser()
    auth.user = response.data?.data || response.data
    localStorage.setItem('user', JSON.stringify(auth.user))
  } catch (error) {
    console.error(error)
  }
}

const requestLogout = () => {
  showLogoutConfirm.value = true
}

const cancelLogout = () => {
  showLogoutConfirm.value = false
}

const confirmLogout = async () => {
  showLogoutConfirm.value = false

  try {
    await logoutUser()
  } catch (error) {
    console.error(error)
  } finally {
    auth.logout()
    router.push('/login')
  }
}

const openLogoutFromMenu = () => {
  closeAccountMenu()
  requestLogout()
}

onMounted(() => {
  if (isAuthenticated.value) {
    cartStore.loadCart().catch(() => undefined)
    wishlistStore.loadWishlist().catch(() => undefined)
    loadCurrentUser().catch(() => undefined)
  }
})
</script>

<template>
  <nav v-if="!isAuthPage" class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">Glowrose</router-link>

      <div class="links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/products" class="nav-link">Products</router-link>
        <router-link v-if="isAuthenticated" to="/wishlist" class="nav-link">
          Wishlist
          <span v-if="wishlistItems" class="count-badge">{{ wishlistItems }}</span>
        </router-link>
        <router-link v-if="isAuthenticated" to="/cart" class="nav-link">
          Cart
          <span v-if="cartItems" class="count-badge">{{ cartItems }}</span>
        </router-link>
        <router-link v-if="isAuthenticated" to="/orders" class="nav-link">Orders</router-link>
      </div>

      <div class="actions">
        <router-link v-if="!isAuthenticated" to="/login" class="nav-link nav-link--ghost">
          Login
        </router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="nav-link nav-link--solid">
          Register
        </router-link>

        <div v-if="isAuthenticated" class="account-wrap">
          <button
            type="button"
            class="avatar-pill"
            aria-label="Account menu"
            @click="toggleAccountMenu"
          >
            <span class="avatar">{{ userInitial }}</span>
            <span class="avatar-name">{{ displayName }}</span>
            <span class="avatar-caret">▾</span>
          </button>

          <div v-if="showAccountMenu" class="account-menu-backdrop" @click.self="closeAccountMenu">
            <div class="account-menu" role="menu" aria-label="Account menu">
              <router-link to="/profile" class="account-menu__item" @click="closeAccountMenu">
                View Profile
              </router-link>
              <button type="button" class="account-menu__item account-menu__item--danger" @click="openLogoutFromMenu">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showLogoutConfirm" class="logout-backdrop" @click.self="cancelLogout">
      <div class="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <div class="logout-icon" aria-hidden="true">⟲</div>
        <h3 id="logout-title">Confirm logout</h3>
        <p>Are you sure you want to log out of your account?</p>
        <div class="logout-actions">
          <button type="button" class="modal-btn modal-btn--ghost" @click="cancelLogout">Cancel</button>
          <button type="button" class="modal-btn modal-btn--solid" @click="confirmLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(14px);
  background: rgba(255, 248, 241, 0.9);
  border-bottom: 1px solid rgba(255, 149, 82, 0.16);
  box-shadow: 0 8px 24px rgba(18, 32, 51, 0.06);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.logo {
  font-size: 1.45rem;
  font-weight: 800;
  /* color: #16243c; */
  text-decoration: none;
  letter-spacing: -0.03em;
}

.links,
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-link,
.avatar-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  color: #41516a;
  text-decoration: none;
  border: 0;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.nav-link:hover,
.avatar-pill:hover {
  background: rgba(255, 122, 21, 0.09);
  color: #ff7a15;
  transform: translateY(-1px);
}

.router-link-active {
  background: rgba(255, 122, 21, 0.12);
  color: #ff7a15;
}

.nav-link--solid {
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(255, 122, 21, 0.24);
}

.nav-link--solid:hover {
  color: #fff;
  background: linear-gradient(90deg, #f56f08 0%, #ff8f39 100%);
}

.nav-link--ghost {
  border: 1px solid rgba(255, 122, 21, 0.18);
  background: rgba(255, 255, 255, 0.7);
}

.avatar-pill {
  border: 1px solid rgba(255, 122, 21, 0.18);
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-weight: 800;
}

.avatar-name {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-caret {
  color: #ff7a15;
  font-size: 0.8rem;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: #16243c;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
}

.logout-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 25, 0.42);
  display: grid;
  place-items: center;
  padding: 20px;
}

.account-wrap {
  position: relative;
}

.account-menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
}

.account-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: min(260px, 82vw);
  padding: 10px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(255, 122, 21, 0.14);
  box-shadow: 0 20px 60px rgba(18, 32, 51, 0.16);
  z-index: 210;
}

.account-menu__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 0;
  background: transparent;
  color: #16243c;
  text-decoration: none;
  text-align: left;
  font-weight: 700;
  cursor: pointer;
}

.account-menu__item:hover {
  background: rgba(255, 122, 21, 0.08);
  color: #ff7a15;
}

.account-menu__item--danger {
  color: #dc2626;
}

.account-menu__item--danger:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.logout-modal {
  width: min(100%, 420px);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #fff8f1 100%);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
  padding: 30px;
  border: 1px solid rgba(255, 122, 21, 0.14);
  transform: translateY(0);
  animation: modal-pop 0.18s ease-out;
  text-align: center;
}

.logout-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(255, 122, 21, 0.25);
}

.logout-modal h3 {
  margin: 0 0 8px;
  font-size: 1.4rem;
  color: #16243c;
}

.logout-modal p {
  margin: 0;
  color: #5f6d82;
}

.logout-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}

.modal-btn {
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 0;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.modal-btn--ghost {
  background: #fff;
  color: #ff7a15;
  border: 1px solid rgba(255, 122, 21, 0.18);
}

.modal-btn--solid {
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  box-shadow: 0 10px 20px rgba(255, 122, 21, 0.22);
}

.modal-btn:hover {
  transform: translateY(-1px);
}

.modal-btn--ghost:hover {
  background: rgba(255, 122, 21, 0.07);
}

.modal-btn--solid:hover {
  box-shadow: 0 14px 26px rgba(255, 122, 21, 0.28);
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 900px) {
  .nav-container {
    flex-wrap: wrap;
    justify-content: center;
  }

  .links,
  .actions {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .nav-container {
    padding: 14px 16px;
  }

  .logo {
    width: 100%;
    text-align: center;
  }

  .avatar-name {
    max-width: 80px;
  }
}
</style>
