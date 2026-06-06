<script setup lang="ts">
const error = useError()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">{{ error?.statusCode }}</h1>
    <p>{{ error?.statusMessage }}</p>
  </div>
</template>

<style scoped>

</style>
