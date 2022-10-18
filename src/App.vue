<script setup>
import { useAuthStore } from './stores/auth'
import { RouterView, useRouter, useRoute } from 'vue-router'
import DefaultLayout from './views/layouts/DefaultLayout.vue'
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function setAuth() {
  try {
    await auth.authCheckout()
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}
setAuth()
</script>

<template>
  <!-- <pre>{{ route }}</pre> -->
  <component :is="route.meta.layout || DefaultLayout">
    <RouterView />
  </component>
</template>

<style>
</style>
