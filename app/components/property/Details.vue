<script setup lang="ts">

</script>

<template>
  <div class="border border-zinc-200 rounded-xl flex flex-col gap-2 p-4">
    <h3 class="text-xl font-bold mb-2">Деталі об'єкту</h3>
    <div class="flex gap-2 items-center">
      <div class="h-[30px] w-[30px] bg-green-200 rounded flex items-center justify-center">
        <LucidePhone />
      </div>
      <div class="flex flex-col justify-center">
        <span class="uppercase text-xs text-zinc-500">Phone</span>
        <Label class="text-sm">+1 (541) 820-4100 </Label>
      </div>
    </div>

    <div class="flex gap-2 items-center">
      <div class="h-[30px] w-[30px] bg-green-200 rounded flex items-center justify-center">
        <LucideMapPin />
      </div>
      <div class="flex flex-col justify-center">
        <span class="uppercase text-xs text-zinc-500">Location</span>
        <Label class="text-sm">Cascade Ridge, Oregon</Label>
      </div>
    </div>


  </div>

</template>

<style scoped>

</style>
