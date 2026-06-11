<script setup lang="ts">

const info = [
  {title: 'Юнітів', value: '4', suffix: ''},
  {title: 'Макс. гостей', value: '10', suffix: ''},
  {title: 'Броні', value: '75', suffix: '%'},
  {title: 'Мін. ціна', value: '1 200', suffix: '₴'},
  {title: 'Рейтинг', value: '4.5', suffix: ''},
]
</script>

<template>
  <div class="grid grid-cols-5 overflow-hidden rounded-xl border border-zinc-200 divide-x divide-zinc-200 bg-white">
    <div
      v-for="item in info"
      :key="item.title"
      class="flex flex-col justify-center gap-2 px-5 py-4"
    >
      <div class="flex items-center gap-2 text-zinc-500">
        <LucideBedDouble
          v-if="item.title === 'Юнітів'"
          class="size-4 shrink-0"
        />
        <LucideUsers
          v-else-if="item.title === 'Макс. гостей'"
          class="size-4 shrink-0"
        />
        <LucideTrendingUp
          v-else-if="item.title === 'Броні'"
          class="size-4 shrink-0"
        />
        <LucideStar
          v-else-if="item.title === 'Рейтинг'"
          class="size-4 shrink-0"
        />
        <LucideHryvnia
          v-else-if="item.title === 'Мін. ціна'"
          class="size-4 shrink-0"
        />

        <span class="text-xs font-medium tracking-wide whitespace-nowrap">
        {{ item.title }}
      </span>
      </div>

      <div class="flex items-baseline">
      <span class="text-2xl font-semibold leading-none tracking-tight text-zinc-900">
        {{ item.value }}
      </span>

        <span
          v-if="item.suffix"
          class="ml-1 text-sm font-medium text-zinc-900"
        >
        {{ item.suffix }}
      </span>
      </div>
    </div>
  </div>
</template>
