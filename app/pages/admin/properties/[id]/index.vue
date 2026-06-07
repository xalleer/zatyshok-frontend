<script setup lang="ts">
const route = useRoute()

const propertyStore = usePropertyStore()

const {data: property} = await useAsyncData(() => propertyStore.getAdminPropertyById(route.params.id as string))

if (property.value) {
  propertyStore.setProperty(property.value)
}
</script>

<template>
{{ property }}
</template>

<style scoped>

</style>
