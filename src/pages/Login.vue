<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/services/authService'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const errors = ref<Record<string, string[]>>({})
const isLoading = ref(false)

const resolveUser = (data: any) => {
  return data?.user ?? data?.data?.user ?? data?.data ?? data
}

const submit = async () => {
  isLoading.value = true
  try {
    const res = await loginUser(form.value)
    auth.setAuth(resolveUser(res.data), res.data.token)
    router.push('/')
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['Invalid email or password'] }
    }
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="back-btn" title="Back to Homepage">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </router-link>
        <div class="logo">🛒 MyShop</div>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to continue shopping</p>
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email address"
            required
          />
          <div v-if="errors.email" class="error-message">{{ errors.email[0] }}</div>
        </div>

        <div class="form-group">
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
          />
          <div v-if="errors.password" class="error-message">{{ errors.password[0] }}</div>
        </div>

        <div v-if="errors.general" class="error-message text-center mb-4">
          {{ errors.general[0] }}
        </div>

        <button type="submit" class="auth-btn" :disabled="isLoading">
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-switch">
        Don't have an account?
        <router-link to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff7ed 0%, #fef3e8 100%);
  padding: 20px;
  font-family: 'Inter', system-ui, sans-serif;
}

.auth-card {
  background: white;
  border-radius: 28px;
  padding: 52px 44px;
  box-shadow: 0 25px 70px rgba(249, 115, 22, 0.12);
  width: 100%;
  max-width: 440px;
  text-align: center;
  position: relative;
}

.auth-header {
  margin-bottom: 40px;
}

.logo {
  font-size: 2rem;
  margin-bottom: 16px;
}

.auth-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2.1rem;
  font-weight: 700;
  color: #1e2937;
  margin: 0 0 8px;
}

.auth-subtitle {
  color: #64748b;
  font-size: 1.05rem;
  margin: 0;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.back-btn:hover {
  color: #f97316;
  background: rgba(249, 115, 22, 0.08);
  border-color: rgba(249, 115, 22, 0.15);
  transform: translateX(-2px);
}

.back-btn svg {
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 22px;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 18px 22px;
  border: 2px solid #fed7aa;
  border-radius: 16px;
  font-size: 1.02rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 8px;
}

.auth-btn {
  width: 100%;
  padding: 18px;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.auth-btn:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-switch {
  margin-top: 28px;
  font-size: 1rem;
  color: #64748b;
}

.auth-switch a {
  color: #f97316;
  font-weight: 600;
  text-decoration: none;
}

.auth-switch a:hover {
  text-decoration: underline;
}

.forgot-password {
  margin-top: 16px;
  font-size: 0.95rem;
}

.forgot-password a {
  color: #f97316;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
