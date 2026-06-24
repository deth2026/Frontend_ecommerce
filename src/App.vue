<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ToastStack from '@/components/ToastStack.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')
const hideNav = computed(() => route.path === '/login' || route.path === '/register')
</script>

<template>
  <Navbar v-if="!hideNav" />
  <router-view />
  <Footer v-if="!isAuthPage" />
  <ToastStack />
</template>
