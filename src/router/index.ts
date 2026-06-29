import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Products from '@/pages/Products.vue'
import About from '@/pages/About.vue'
import Contact from '@/pages/Contact.vue'
import Cart from '@/pages/Cart.vue'
import Wishlish from '@/pages/Wishlish.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Checkout from '@/pages/Checkout.vue'
import Orders from '@/pages/Orders.vue'
import OrderSuccessView from '@/pages/OrderSuccessView.vue'
import Profile from '@/pages/Profile.vue'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/products',
      component: Products,
    },
    {
      path: '/about',
      component: About,
    },
    {
      path: '/contact',
      component: Contact,
    },
    {
      path: '/products/:id',
      component: ProductDetail,
      props: true,
    },
    {
      path: '/cart',
      component: Cart,
      meta: { requiresAuth: true },
    },
    {
      path: '/wishlist',
      component: Wishlish,
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      component: Checkout,
      meta: { requiresAuth: true },
    },
    {
      path: '/order-success',
      component: OrderSuccessView,
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      component: Orders,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
    return '/'
  }
})

export default router
