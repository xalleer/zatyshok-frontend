<script setup lang="ts">
import type { Property } from '~/types'

defineProps<{
  property: Property
}>()
</script>

<template>
  <Card class="overflow-hidden p-0 gap-0 cursor-pointer hover:shadow-md transition-shadow">

    <div class="relative h-48 bg-muted overflow-hidden">
      <img
        :src="property.coverImage"
        :alt="property.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <Badge class="absolute top-3 left-3 bg-white/90 text-foreground text-xs rounded-full px-2 py-1">
        Глемпінг
      </Badge>

      <div class="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-medium">
        <svg class="size-3.5 fill-yellow-400 text-yellow-400 lucide lucide-star-icon lucide-star" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        {{ property.rating?.description ?? '—' }}
        <span class="opacity-75">· {{ property.reviewCount }} відгуків</span>
      </div>
    </div>

    <CardHeader class="p-4">
      <p class="text-xs text-muted-foreground uppercase tracking-wide font-medium">
        Природа · Карпати
      </p>
      <CardTitle class="text-base leading-snug">{{ property.name }}</CardTitle>
      <CardDescription class="flex items-center gap-1 text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin size-3"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
        {{ property.city }}, {{ property.address }}
      </CardDescription>
    </CardHeader>

<!--    <CardContent class="px-4 py-3 flex gap-2 flex-wrap">-->
<!--      <Badge variant="secondary" class="text-xs font-normal">-->
<!--        <Users class="size-3 mr-1" /> 2 гостей-->
<!--      </Badge>-->
<!--      <Badge variant="secondary" class="text-xs font-normal">-->
<!--        <Wifi class="size-3 mr-1" /> Wi-Fi-->
<!--      </Badge>-->
<!--      <Badge variant="secondary" class="text-xs font-normal">-->
<!--        <Flame class="size-3 mr-1" /> Багаття-->
<!--      </Badge>-->
<!--    </CardContent>-->

    <CardFooter class="px-4 pb-4 flex items-center justify-between border-t pt-3">
      <div>
        <p class="text-xs text-muted-foreground">від</p>
        <p class="text-lg font-semibold">
          500 ₴ <span class="text-sm font-normal text-muted-foreground">/ ніч</span>
        </p>
      </div>
      <Button size="sm">Детальніше</Button>
    </CardFooter>

  </Card>
</template>
