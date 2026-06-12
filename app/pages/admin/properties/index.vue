<script setup lang="ts">
import {Plus} from '@lucide/vue'

const currentPage = ref(1)
const {data, pending} = await useAdminProperties(currentPage)

const onPageChange = (page: number) => {
  currentPage.value = page
}

const openPropertyDetails = (id: string) => {
  navigateTo(`/admin/properties/${id}`)
}

const openCreateProperty = () => {
  navigateTo('/admin/properties/create')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h3 class="text-2xl font-semibold">Мої об'єкти</h3>
      <Button @click="openCreateProperty">
        <Plus/>
        Додати об'єкт
      </Button>
    </div>

    <template v-if="pending">
      <div class="grid grid-cols-3 gap-4">
        <Skeleton v-for="n in 6" :key="n" class="h-64 rounded-xl"/>
      </div>
    </template>

    <template v-else-if="data?.data.length">
      <TransitionGroup
          name="list"
          tag="div"
          class="flex flex-col"
      >
        <AdminPropertyCard
            @open-property-details="openPropertyDetails($event)"
            v-for="(property, i) in data.data"
            :key="property.id"
            :property="property"
            :style="{ '--delay': `${i * 60}ms` }"
        />
      </TransitionGroup>

      <Pagination
          v-if="data.meta.totalPages > 1"
          v-slot="{ page }"
          :total="data.meta.total"
          :items-per-page="data.meta.limit"
          :default-page="currentPage"
          @update:page="onPageChange"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious/>

          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :index="index"/>
          </template>

          <PaginationNext/>
        </PaginationContent>
      </Pagination>
    </template>

    <template v-else>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Немає об'єктів</EmptyTitle>
          <EmptyDescription>
            Додайте перший об'єкт для оренди
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <Plus/>
            Додати об'єкт
          </Button>
        </EmptyContent>
      </Empty>
    </template>
  </div>
</template>