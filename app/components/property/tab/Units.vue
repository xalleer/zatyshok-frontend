<script setup lang="ts">
const route = useRoute()
const propertyId = route.params.id as string

const handleUnitCreated = () => {
  // тут можна зробити refetch units
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="flex justify-end">
      <AdminUnitCreateUnitSheet
        :property-id="propertyId"
        @done="handleUnitCreated"
      />
    </section>

    <section class="flex flex-col gap-6">
      <AdminUnitCard />
      <AdminUnitCard />
      <AdminUnitCard />
    </section>
  </div>
</template>
