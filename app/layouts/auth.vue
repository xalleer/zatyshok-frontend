<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
    <main class="flex items-center justify-center p-6 relative">
      <Button class="absolute top-6 left-6" variant="link">
        <NuxtLink :to="{name: 'index'}">
          Назад
        </NuxtLink>
      </Button>
      <slot />
    </main>

    <aside class="hidden lg:flex items-center justify-center bg-gray-50 border-l">
      <img class="h-screen w-full object-cover" src="~/assets/img/auth-bg.png" alt="Background">
    </aside>
  </div>
</template>

<style scoped>

</style>
