<template>
  <NuxtLayout>
    <Toaster position="top-right" :expand="false" richColors/>
    <NuxtPage />
    <CookieBanner />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.985);
}

.page-leave-to {
  opacity: 0;
}
</style>
