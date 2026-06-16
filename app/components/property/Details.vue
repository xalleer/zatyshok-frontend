<script setup lang="ts">

</script>

<template>
  <div class="border border-zinc-100 rounded-2xl bg-white shadow-sm p-5 flex flex-col gap-4">

    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-zinc-900 tracking-tight">Деталі об'єкту</h3>
    </div>

    <div class="h-px bg-zinc-100" />

    <div class="flex flex-col gap-3">

      <div class="flex items-center gap-3">
        <div class="size-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <LucidePhone class="size-4 text-emerald-600" />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] uppercase tracking-widest font-medium text-zinc-400">Phone</span>
          <span class="text-sm font-medium text-zinc-800">+1 (541) 820-4100</span>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="size-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <LucideMapPin class="size-4 text-emerald-600" />
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] uppercase tracking-widest font-medium text-zinc-400">Location</span>
          <span class="text-sm font-medium text-zinc-800">Cascade Ridge, Oregon</span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
