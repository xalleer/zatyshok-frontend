<script setup lang="ts">
type Icon = 'wifi'
interface Props {
  title: string
  icon: Icon
}


const props = defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div class="flex items-center gap-2 border border-zinc-200 rounded-xl p-2 min-h-[75px]">
      <LucideWifi />
      <Label>{{ title }}</Label>
    </div>
  </div>
</template>
