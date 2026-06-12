<script setup lang="ts">

import type {Property} from "~/types";

const props = defineProps<{
  property: Property
}>()

const emit = defineEmits<{
  (e: 'openPropertyDetails', id: string): void
}>()

</script>

<template>
  <div class="p-4 mt-4 border border-zinc-200 rounded-xl flex flex-col gap-2">
    <div class="flex justify-between items-center border-b border-zinc-200 pb-2">
      <div class="flex gap-2 items-center">
        <div class="p-2 rounded-xl bg-green-200">
          <LucideShrub />
        </div>

        <div>
          <h3>{{ property.name }}</h3>
          <Badge>Forest Retreat</Badge>
        </div>
      </div>

      <div class="flex gap-2 items-center">
        <Button @click="emit('openPropertyDetails', property.id)" variant="outline">View Details</Button>
        <Button size="icon">
          <LucideEllipsis />
        </Button>
      </div>

    </div>
    <div class="flex gap-4 items-center py-2 border-b border-zinc-200">
      <div class="flex flex-col gap-1">
        <span class="text-xs text-zinc-500">Units</span>
        <Label>3</Label>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-xs text-zinc-500">Occupied</span>
        <Label>3</Label>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-xs text-zinc-500">Occupancy</span>
        <Label>75%</Label>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-xs text-zinc-500">Revenue</span>
        <Label>$14,200 /mo</Label>
      </div>
    </div>
    <div class="flex gap-2 items-center py-2">
      <Badge>
        <span class="w-[5px] h-[5px] bg-green-500 rounded-full"></span>
        <span>Treehouse Loft</span>
      </Badge>

      <Badge>
        <span class="w-[5px] h-[5px] bg-green-500 rounded-full"></span>
        <span>Treehouse Loft</span>
      </Badge>

      <Badge>
        <span class="w-[5px] h-[5px] bg-green-500 rounded-full"></span>
        <span>Treehouse Loft</span>
      </Badge>
    </div>
  </div>

</template>
