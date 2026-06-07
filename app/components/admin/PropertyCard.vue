<!-- components/admin/AdminPropertyCard.vue -->
<script setup lang="ts">
import { Eye, EyeOff, Pencil, Trash2, Building2 } from '@lucide/vue'
import type { Property } from '~/types'

const props = defineProps<{ property: Property }>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
  toggleActive: [id: string]
  viewUnits: [id: string]
}>()
</script>

<template>
  <Card class="overflow-hidden p-0 gap-0">

    <!-- Фото -->
    <div class="relative h-44 overflow-hidden bg-muted">
      <img
        v-if="property.coverImage"
        :src="property.coverImage"
        :alt="property.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <Badge
        class="absolute top-3 right-3"
        :class="property.isActive
          ? 'bg-green-500/15 text-green-700 border-green-500/30'
          : 'bg-muted text-muted-foreground'"
        variant="outline"
      >
        {{ property.isActive ? '● Активний' : '○ Неактивний' }}
      </Badge>

      <div class="absolute bottom-3 left-3 flex gap-3">
        <span class="flex items-center gap-1 text-white text-xs font-medium">
          <Star class="size-3 fill-yellow-400 text-yellow-400" />
          {{ property.rating?.description ?? '—' }}
        </span>
        <span class="flex items-center gap-1 text-white text-xs">
          <MessageCircle class="size-3" />
          {{ property.reviewCount }} відгуків
        </span>
      </div>
    </div>

    <!-- Інфо -->
    <CardHeader class="px-4 pt-4 pb-2">
      <CardTitle class="text-base">{{ property.name }}</CardTitle>
      <CardDescription class="flex items-center gap-1 text-xs">
        <MapPin class="size-3" />
        {{ property.city }}, {{ property.address }}
      </CardDescription>
    </CardHeader>

    <CardContent class="px-4 pb-3">
      <div class="grid grid-cols-4 gap-2 text-center">
        <div v-for="stat in stats" :key="stat.label">
          <p class="text-[10px] uppercase tracking-wide text-muted-foreground">{{ stat.label }}</p>
          <p class="text-sm font-medium">{{ stat.value }}</p>
        </div>
      </div>
    </CardContent>

    <!-- Дії -->
    <CardFooter class="px-4 pb-4 pt-3 border-t flex items-center gap-2">
      <!-- Button group -->
      <div class="flex rounded-md border overflow-hidden">
        <Button
          size="sm" variant="ghost"
          class="rounded-none border-r text-xs gap-1.5 h-8"
          @click="emit('edit', property.id)"
        >
          <Pencil class="size-3.5" /> Редагувати
        </Button>
        <Button
          size="sm" variant="ghost"
          class="rounded-none border-r text-xs gap-1.5 h-8"
          @click="emit('viewUnits', property.id)"
        >
          <Building2 class="size-3.5" /> Юніти
        </Button>
        <Button
          size="sm" variant="ghost"
          class="rounded-none text-xs h-8 px-3"
          :class="property.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-primary'"
          @click="emit('toggleActive', property.id)"
        >
          <EyeOff v-if="property.isActive" class="size-3.5" />
          <Eye v-else class="size-3.5" />
        </Button>
      </div>

      <div class="flex-1" />

      <Button
        size="icon-sm" variant="ghost"
        class="text-destructive hover:text-destructive hover:bg-destructive/10"
        @click="emit('delete', property.id)"
      >
        <Trash2 class="size-4" />
      </Button>
    </CardFooter>

  </Card>
</template>
