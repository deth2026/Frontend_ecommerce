<template>
  <router-link :to="`/products?category=${category.id}`" class="category-card">
    <div class="card-icon">{{ getCategoryIcon(category.name) }}</div>
    <h3 class="card-name">{{ category.name }}</h3>
    <p class="card-count">{{ category.products?.length || 0 }} items</p>
  </router-link>
</template>

<script setup lang="ts">
const props = defineProps<{
  category: {
    id: number
    name: string
    products?: any[]
  }
}>()

const getCategoryIcon = (name: string) => {
  const icons: Record<string, string> = {
    Electronics: '📱',
    Fashion: '👗',
    Home: '🏠',
    Beauty: '💄',
    Sports: '⚽',
    Books: '📚',
    Toys: '🧸',
    Food: '🍎',
  }
  return icons[name] || '📦'
}
</script>

<style scoped>
.category-card {
  min-height: 180px;
  display: grid;
  align-content: center;
  gap: 10px;
  background:
    radial-gradient(circle at top, rgba(249, 115, 22, 0.12), transparent 38%),
    linear-gradient(180deg, #ffffff 0%, #fffaf4 100%);
  border-radius: 24px;
  padding: 26px 20px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 28px rgba(18, 32, 51, 0.06);
  text-align: center;
  border: 2px solid #ffe8d6;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(249, 115, 22, 0.2);
  border-color: #f97316;
}

.card-icon {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  margin: 0 auto 6px;
  border-radius: 22px;
  background: #fff0e4;
  font-size: 2.2rem;
}

.card-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e2937;
  margin: 0 0 6px;
}

.card-count {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}
</style>
