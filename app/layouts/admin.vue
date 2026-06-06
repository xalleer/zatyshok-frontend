<script setup lang="ts">

</script>

<template>
  <div>
    <AppHeader :isAdmin="true"/>
    <SidebarProvider>
      <AppSidebar/>
      <main class="min-h-screen">
        <SidebarTrigger/>
        <slot/>
      </main>
    </SidebarProvider>

    <AppFooter/>
  </div>
</template>

<style scoped>

</style>
