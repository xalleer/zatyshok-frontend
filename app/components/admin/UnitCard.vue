<script setup lang="ts">

</script>

<template>
  <div class="group relative grid grid-cols-5 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">

    <div class="col-span-2 relative overflow-hidden">
      <img
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src="~/assets/img/card-mock.png"
        alt="Unit"
      />
      <div class="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm shadow-sm">
        <LucideStar class="size-3.5 fill-amber-400 text-amber-400" />
        <span class="text-xs font-semibold text-zinc-800">4.8</span>
        <span class="text-xs text-zinc-400">(62)</span>
      </div>
    </div>

    <div class="col-span-3 flex flex-col justify-between p-5 gap-4">

      <div class="flex flex-col gap-2">
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col gap-1.5">
            <h4 class="text-lg font-bold leading-tight text-zinc-900 tracking-tight">Treehouse Loft</h4>

            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                Treehouse
              </span>
              <span class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <span class="size-1.5 rounded-full bg-emerald-500"></span>
                Available
              </span>
            </div>
          </div>

          <div class="flex shrink-0 gap-1.5 items-center">
            <Button variant="outline" size="sm" class="text-xs h-8">Manage</Button>
            <Button variant="ghost" size="icon" class="size-8 text-zinc-400 hover:text-zinc-700">
              <LucideEllipsis class="size-4" />
            </Button>
          </div>
        </div>

        <div class="flex items-center gap-4 pt-0.5">
          <div class="flex items-center gap-1.5 text-sm text-zinc-500">
            <LucideBedDouble class="size-3.5 text-zinc-400" />
            <span>2 bed</span>
          </div>
          <div class="flex items-center gap-1.5 text-sm text-zinc-500">
            <LucideUsers class="size-3.5 text-zinc-400" />
            <span>Up to 2 guests</span>
          </div>
        </div>
      </div>

      <div class="h-px bg-zinc-100" />

      <div class="flex flex-col gap-3">
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-bold text-zinc-900">₴500</span>
          <span class="text-sm text-zinc-400 font-normal">/ night</span>
        </div>

        <div class="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2.5 border border-zinc-100">
          <LucideCalendar class="size-3.5 text-zinc-400 shrink-0" />
          <span class="text-xs text-zinc-500">Next booking: <b class="font-semibold text-zinc-700">14 Jun</b></span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
