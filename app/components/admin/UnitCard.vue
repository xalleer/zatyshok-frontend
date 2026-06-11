<script setup lang="ts">

</script>

<template>
  <div class="grid grid-cols-3 min-h-[300px] border border-zinc-200 rounded-xl">
    <div class="col-span-1 h-full">
      <img class="h-full w-full object-cover rounded-bl-xl rounded-tl-xl" src="~/assets/img/card-mock.png" alt="Unit">
    </div>
    <div class="col-span-2 p-4 gap-6 flex flex-col">
      <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <h4 class="text-xl font-bold">Treehouse Loft</h4>

          <div class="flex gap-2 items-center">
            <Button variant="outline">Manage</Button>
            <Button size="icon">
              <LucideEllipsis />
            </Button>
          </div>
        </div>

        <Badge>Treehouse</Badge>
        <Badge>
          <span class="w-[5px] h-[5px] rounded-full bg-green-900"></span>
          <span class="text-xs">Available</span>
        </Badge>


        <div class="flex items-center gap-6 mt-2">
          <div class="flex gap-1 items-center">
            <LucideBedDouble class="size-4"/>
            <span>2 bed</span>
          </div>
          <div class="flex gap-1 items-center">
            <LucideUsers class="size-4"/>
            <span>Up to 2 guests</span>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span>₴500/night</span>
        </div>

        <div class="flex items-center gap-1">
          <div class="flex items-center">
            <LucideStar class="size-4" v-for="n in 5" :key="n"/>
          </div>
          <span class="font-medium">4.8</span>
          <span>(62)</span>
        </div>
      </div>

      <div class="flex items-center p-3 gap-2 rounded-xl border border-zinc-200">
        <LucideCalendar class="size-4"/>
        <span class="text-sm">Next booking: <b>14 Jun</b></span>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
