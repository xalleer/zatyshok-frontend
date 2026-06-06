<script setup lang="ts">

</script>

<template>
  <div>
    <AppHeader :isAdmin="false"/>
    <main class="min-h-screen">
      <slot/>
    </main>
    <AppFooter/>
  </div>
</template>

<style scoped>

</style>
