<script setup lang="ts">
import { Ellipsis, Plus, Shrub } from '@lucide/vue';

const {data, pending, refresh} = useAdminProperties()

const openPropertyDetails = () => {
  navigateTo('/admin/properties/1')
}
</script>

<template>
  <div>
    <section>
      <div class="flex justify-between items-center">
        <h3 class="text-2xl font-semibold">All Properties</h3>
        <Button>
          <Plus />
          <span>Add Property</span>
        </Button>
      </div>


    </section>
  </div>
</template>

<style scoped>

</style>
