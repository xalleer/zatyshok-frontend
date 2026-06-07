<script setup lang="ts">
const propertyStore = usePropertyStore()

const { data: adminProperties, pending } = useAsyncData(() => propertyStore.getMyAdminProperties())

onMounted(() => {
  if (!pending.value && adminProperties.value) {
    propertyStore.setAdminProperties(adminProperties.value)
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen">

    <SidebarProvider class="flex flex-1 overflow-hidden">
      <AppSidebar/>
      <SidebarInset class="flex flex-col flex-1 min-w-0">
        <main class="flex-1 overflow-auto p-4">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>

  </div>
</template>

<style scoped>

</style>
