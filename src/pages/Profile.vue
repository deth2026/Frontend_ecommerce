<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logoutUser } from '@/services/authService'
import { getOrders } from '@/services/orderService'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const user = ref<any>(auth.user || {})
const orders = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const resolveUser = (payload: any) => payload?.user ?? payload?.data?.user ?? payload?.data ?? payload

const mergedUser = computed(() => ({
  ...auth.user,
  ...user.value,
}))

const userInitial = computed(() => {
  const name = mergedUser.value?.name || mergedUser.value?.full_name || mergedUser.value?.email || 'U'
  return String(name).charAt(0).toUpperCase()
})

const totalSpent = computed(() => {
  return orders.value.reduce((sum, order) => {
    const amount = Number(order.total_amount ?? order.total ?? order.amount ?? 0)
    return sum + amount
  }, 0)
})

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const loadProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    const [profileResponse, ordersResponse] = await Promise.all([getUser(), getOrders()])

    const resolvedUser = resolveUser(profileResponse.data)
    if (resolvedUser && typeof resolvedUser === 'object') {
      user.value = {
        ...auth.user,
        ...resolvedUser,
      }
      auth.setAuth(user.value, auth.token)
    }

    orders.value = ordersResponse.data || []
  } catch (err) {
    error.value = 'Unable to load profile.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  const confirmed = window.confirm('Are you sure you want to log out?')
  if (!confirmed) return

  try {
    await logoutUser()
  } catch (err) {
    console.error(err)
  } finally {
    auth.logout()
    router.push('/login')
  }
}

onMounted(() => {
  loadProfile().catch(() => undefined)
})
</script>

<template>
  <main class="profile-page">
    <section class="profile-shell">
      <div class="page-head">
        <p class="eyebrow">Profile</p>
        <h1>Your account</h1>
      </div>

      <p v-if="loading" class="state">Loading profile...</p>
      <p v-else-if="error" class="state state--error">{{ error }}</p>

      <div v-else class="profile-card">
        <div class="profile-top">
          <div class="avatar">{{ userInitial }}</div>

          <div class="profile-meta">
            <div class="info">
              <span class="label">Name</span>
              <h2>{{ mergedUser.name || mergedUser.full_name || 'Customer' }}</h2>
            </div>

            <div class="info">
              <span class="label">Email</span>
              <p>{{ mergedUser.email || 'No email available' }}</p>
            </div>
          </div>

          <div class="menu-wrap">
            <button type="button" class="menu-trigger" @click="toggleMenu">
              Account
              <span class="menu-trigger__chevron">▾</span>
            </button>

            <div v-if="showMenu" class="dropdown-backdrop" @click.self="closeMenu">
              <div class="dropdown-menu" role="menu" aria-label="Profile actions">
                <div class="dropdown-user">
                  <div class="dropdown-avatar">{{ userInitial }}</div>
                  <div>
                    <strong>{{ mergedUser.name || mergedUser.full_name || 'Customer' }}</strong>
                    <p>{{ mergedUser.email || 'No email available' }}</p>
                  </div>
                </div>

                <router-link to="/profile" class="dropdown-item" @click="closeMenu">
                  View Profile
                </router-link>
                <button type="button" class="dropdown-item dropdown-item--danger" @click="handleLogout">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="total-box">
          <span class="label">Total</span>
          <strong>${{ totalSpent.toFixed(2) }}</strong>
          <small>Total spent across all orders</small>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 36px 24px 72px;
}

.profile-shell {
  max-width: 920px;
  margin: 0 auto;
}

.page-head {
  margin-bottom: 22px;
}

.page-head h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 800;
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

.profile-card {
  display: grid;
  gap: 18px;
  padding: 30px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 248, 241, 0.98));
  border: 1px solid rgba(255, 122, 21, 0.12);
  box-shadow: 0 18px 50px rgba(18, 32, 51, 0.06);
  max-width: 760px;
}

.profile-top {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: start;
}

.avatar {
  width: 86px;
  height: 86px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  background: linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  box-shadow: 0 14px 28px rgba(255, 122, 21, 0.24);
}

.profile-meta {
  display: grid;
  gap: 14px;
}

.info {
  display: grid;
  gap: 6px;
}

.label {
  color: #7b8798;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 700;
}

.info h2,
.info p,
.total-box strong,
.total-box small {
  margin: 0;
}

.info h2 {
  font-size: 1.8rem;
  color: #16243c;
}

.info p {
  font-size: 1.05rem;
  color: #627085;
}

.total-box {
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: 22px;
  background: #fff8ef;
  border: 1px solid rgba(255, 122, 21, 0.08);
  width: fit-content;
  min-width: 240px;
}

.total-box strong {
  font-size: 2rem;
  color: #16243c;
}

.total-box small {
  color: #7b8798;
}

.actions {
  display: none;
}

.menu-wrap {
  position: relative;
}

.menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 122, 21, 0.16);
  background: #fff;
  color: #16243c;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(18, 32, 51, 0.05);
}

.menu-trigger__chevron {
  color: #ff7a15;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: min(320px, 86vw);
  padding: 14px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid rgba(255, 122, 21, 0.12);
  box-shadow: 0 22px 60px rgba(18, 32, 51, 0.16);
  z-index: 60;
}

.dropdown-user {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 8px 14px;
  border-bottom: 1px solid rgba(255, 122, 21, 0.08);
  margin-bottom: 10px;
}

.dropdown-avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-weight: 800;
}

.dropdown-user strong {
  display: block;
  color: #16243c;
}

.dropdown-user p {
  margin: 4px 0 0;
  color: #627085;
  font-size: 0.92rem;
  word-break: break-word;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 0;
  background: transparent;
  color: #16243c;
  text-align: left;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255, 122, 21, 0.08);
  color: #ff7a15;
}

.dropdown-item--danger {
  color: #dc2626;
}

.dropdown-item--danger:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.state {
  padding: 56px 20px;
  text-align: center;
  color: #627085;
}

.state--error {
  color: #dc2626;
}

@media (max-width: 640px) {
  .profile-card {
    padding: 22px;
  }

  .profile-top {
    grid-template-columns: 1fr;
  }

  .menu-wrap {
    justify-self: start;
  }

  .total-box {
    width: 100%;
    min-width: 0;
  }
}
</style>
