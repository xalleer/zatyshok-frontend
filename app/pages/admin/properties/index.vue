<script setup lang="ts">
const propertyStore = usePropertyStore()

const navigateToProperty = (id: string, path?: string) => {
  if (path) {
    navigateTo(`/admin/properties/${id}/${path}`)
    return
  }
  navigateTo(`/admin/properties/${id}`)
}
</script>

<template>
  <div>
    <section v-if="propertyStore.adminProperties">
      <h2 class="mb-4 text-2xl font-semibold">Мої об'єкти</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminPropertyCard
          @edit="navigateToProperty(property.id, 'configurate')"
          @click="navigateToProperty(property.id)"
          v-for="property of propertyStore.adminProperties?.data"
          :key="property.id"
          :property="property" />
      </div>

    </section>
    <div v-else>
      <Empty>
        <EmptyHeader>
          <p>Null</p>
        </EmptyHeader>
      </Empty>
    </div>
  </div>
</template>

<style scoped>

</style>
