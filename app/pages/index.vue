<script setup lang="ts">

const { data: properties, pending } = await usePublicProperties()
</script>

<template>
<div>
  <section class="bg-amber-100 h-[300px]">

  </section>

  <section class="p-6">
    <h2 class="text-2xl font-semibold tracking-tight mb-6">Популярні зараз</h2>

    <div v-if="pending" class="flex justify-center items-center h-64">
      <Spinner />
    </div>

    <div v-else-if="!pending && properties?.data.length" class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
      <PropertyCard v-for="property in properties?.data" :key="property.id" :property="property" />
    </div>

    <div v-else>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bell />
          </EmptyMedia>
          <EmptyTitle>No Notifications</EmptyTitle>
          <EmptyDescription>
            You're all caught up. New notifications will appear here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <RefreshCcw />
            Refresh
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  </section>
</div>
</template>

<style scoped>

</style>
