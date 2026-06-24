<script setup lang="ts">
interface Props {
  brandName?: string
  brandTagline?: string
  formLabel?: string
  formTitle?: string
  formSubtitle?: string
}

withDefaults(defineProps<Props>(), {
  brandName: 'Glowrose',
  brandTagline: 'Fresh picks for your everyday moments',
  formLabel: 'Welcome back',
  formTitle: 'Login below to get started.',
  formSubtitle: '',
})
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <div class="brand-panel">
        <div class="brand-copy">
          <p class="brand-name">{{ brandName }}</p>
          <h1 class="brand-tagline">{{ brandTagline }}</h1>
        </div>
      </div>

      <div class="form-panel">
        <div class="form-shell">
          <p class="form-label">{{ formLabel }}</p>
          <h2 class="form-title">{{ formTitle }}</h2>
          <p v-if="formSubtitle" class="form-subtitle">{{ formSubtitle }}</p>

          <slot />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.26), transparent 24%),
    linear-gradient(135deg, #ee6c8b 0%, #f36d6c 50%, #f8a65b 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.auth-card {
  width: min(1100px, 100%);
  min-height: 640px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(98, 25, 47, 0.28);
}

.brand-panel {
  position: relative;
  display: flex;
  align-items: center;
  padding: 56px;
  color: #fff;
  background: linear-gradient(180deg, #ffb65d 0%, #ff9f5a 55%, #ff8c52 100%);
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  width: 760px;
  height: 760px;
  border-radius: 50%;
  left: -420px;
  top: -70px;
  background: radial-gradient(circle at 35% 35%, #ffcf7b 0%, #ffac59 42%, #f68d54 78%, #ef754e 100%);
}

.brand-copy {
  position: relative;
  z-index: 1;
  max-width: 280px;
}

.brand-name {
  margin: 0 0 14px;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-tagline {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 3.5vw, 3.15rem);
  line-height: 1.08;
  font-weight: 700;
  text-wrap: balance;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 44px;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(255, 255, 255, 1)),
    linear-gradient(135deg, rgba(255, 207, 125, 0.16), rgba(255, 255, 255, 0));
}

.form-shell {
  width: min(100%, 380px);
  text-align: center;
}

.form-label {
  margin: 0 0 10px;
  color: #9aa3b2;
  font-size: 0.98rem;
  font-weight: 500;
}

.form-title {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  line-height: 1.15;
  color: #1e293b;
}

.form-subtitle {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 0.98rem;
}

@media (max-width: 920px) {
  .auth-card {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .brand-panel {
    min-height: 260px;
    justify-content: center;
    text-align: center;
  }

  .brand-copy {
    max-width: 360px;
  }
}

@media (max-width: 640px) {
  .auth-page {
    padding: 14px;
  }

  .brand-panel,
  .form-panel {
    padding: 32px 20px;
  }

  .brand-panel::before {
    width: 620px;
    height: 620px;
    left: -400px;
    top: -110px;
  }
}
</style>
