<script setup lang="ts">
const props = defineProps<{
  isAdmin: boolean
}>()

</script>

<template>
  <header class="flex items-center justify-between p-4 border-b border-gray-200 h-16">
    <div class="logo">
      <h1>Затишок</h1>
    </div>

    <div class="actions" v-if="!isAdmin">
      <Button variant="outline">
        <NuxtLink :to="{name: 'auth-business-register'}">
          Для власників
        </NuxtLink>
      </Button>
    </div>

  </header>
</template>

<style scoped>

</style>
