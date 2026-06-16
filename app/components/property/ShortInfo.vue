<script setup lang="ts">

const info = [
  { title: 'Юнітів',      value: '4',      suffix: '',  icon: 'bed' },
  { title: 'Макс. гостей', value: '10',     suffix: '',  icon: 'users' },
  { title: 'Броні',        value: '75',     suffix: '%', icon: 'trending' },
  { title: 'Мін. ціна',   value: '1 200',  suffix: '₴', icon: 'hryvnia' },
  { title: 'Рейтинг',     value: '4.5',    suffix: '',  icon: 'star' },
]
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden divide-y divide-zinc-100 lg:divide-y-0 lg:divide-x">

    <div
      v-for="(item, index) in info"
      :key="item.title"
      class="flex flex-col gap-3 px-5 py-4 transition-colors duration-150 hover:bg-zinc-50"
      :class="{ 'col-span-2 sm:col-span-1': index === info.length - 1 && info.length % 2 !== 0 }"
    >
      <div class="flex items-center gap-1.5">
        <LucideBedDouble    v-if="item.icon === 'bed'"      class="size-3.5 shrink-0 text-zinc-400" />
        <LucideUsers        v-else-if="item.icon === 'users'"    class="size-3.5 shrink-0 text-zinc-400" />
        <LucideTrendingUp   v-else-if="item.icon === 'trending'"  class="size-3.5 shrink-0 text-zinc-400" />
        <LucideHryvnia      v-else-if="item.icon === 'hryvnia'"   class="size-3.5 shrink-0 text-zinc-400" />
        <LucideStar         v-else-if="item.icon === 'star'"     class="size-3.5 shrink-0 text-zinc-400" />

        <span class="text-[10px] uppercase tracking-widest font-medium text-zinc-400 whitespace-nowrap">
          {{ item.title }}
        </span>
      </div>

      <div class="flex items-baseline gap-0.5">
        <span class="text-2xl font-bold leading-none tracking-tight text-zinc-900">
          {{ item.value }}
        </span>
        <span v-if="item.suffix" class="text-sm font-semibold text-zinc-500 leading-none">
          {{ item.suffix }}
        </span>
      </div>
    </div>

  </div>
</template>
