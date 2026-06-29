<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/authService'
import { useAuthStore } from '@/store/auth.ts'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = ref<Record<string, string[]>>({})
const isLoading = ref(false)

const resolveUser = (data: any) => {
  return data?.user ?? data?.data?.user ?? data?.data ?? data
}

const submit = async () => {
  isLoading.value = true
  try {
    const res = await registerUser(form.value)
    const user = resolveUser(res.data)
    auth.setAuth(user, res.data.token)
    router.push('/profile')
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    console.log(error)
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
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join us today</p>
      </div>

      <div class="form-group">
        <input v-model="form.name" type="text" placeholder="Full Name" required />
        <div v-if="errors.name" class="error-message">{{ errors.name[0] }}</div>
      </div>

      <div class="form-group">
        <input v-model="form.email" type="email" placeholder="Email address" required />
        <div v-if="errors.email" class="error-message">{{ errors.email[0] }}</div>
      </div>

      <div class="form-group">
        <input v-model="form.password" type="password" placeholder="Password" required />
        <div v-if="errors.password" class="error-message">{{ errors.password[0] }}</div>
      </div>

      <div class="form-group">
        <input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" required />
        <div v-if="errors.password_confirmation" class="error-message">{{ errors.password_confirmation[0] }}</div>
      </div>

      <button @click="submit" class="auth-btn" :disabled="isLoading">
        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
      </button>

      <p class="auth-switch">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff7ed 0%, #fef3e8 100%);
  font-family: 'Inter', system-ui, sans-serif;
  padding: 24px;
}

.auth-card {
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e2937;
  margin: 0 0 8px;
}

.auth-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 32px;
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
  margin-bottom: 20px;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #f97316;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 6px;
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: #f97316;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.auth-btn:hover:not(:disabled) {
  background: #ea580c;
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-switch {
  margin-top: 24px;
  font-size: 0.95rem;
  color: #64748b;
}

.auth-switch a {
  color: #f97316;
  text-decoration: none;
  font-weight: 500;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>
