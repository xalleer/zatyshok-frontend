<script setup lang="ts">

const { data: properties, pending } = await usePublicProperties()
console.log(properties.value)
</script>

<template>
<div>
  <section class="bg-amber-100 h-[300px]">

  </section>

  <section class="p-6">
    <h2 class="text-2xl font-semibold tracking-tight mb-6">Популярні зараз</h2>

    <div v-if="pending" class="flex justify-center items-center h-64">
      <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        <div v-for="n in 8" :key="n" class="flex flex-col gap-2">
          <Skeleton class="h-48 rounded-xl" />
          <Skeleton class="h-4 w-3/4 rounded" />
          <Skeleton class="h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>

    <div v-else-if="!pending && properties?.data.length" class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
      {{ properties?.data }}
    </div>

    <div v-else>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LucideBell />
          </EmptyMedia>
          <EmptyTitle>No Notifications</EmptyTitle>
          <EmptyDescription>
            You're all caught up. New notifications will appear here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <LucideRefreshCcw />
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
