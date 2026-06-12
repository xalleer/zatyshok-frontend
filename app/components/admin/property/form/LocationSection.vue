<script setup lang="ts">
const { value: lat, setValue: setLat } = useField<number>('latitude')
const { value: lon, setValue: setLon } = useField<number>('longitude')
</script>

<template>
  <div class="rounded-xl border p-6 border-zinc-200 flex flex-col gap-6">
    <div>
      <h4 class="text-xl font-semibold">Локація</h4>
      <span class="text-sm text-muted-foreground">Назва та опис, які побачать гості</span>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="city">
        <FormItem>
          <FormLabel>Місто</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Полтава" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="address">
        <FormItem>
          <FormLabel>Адреса</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="вул. Соснова, 1" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <FormField name="latitude">
        <FormItem>
          <FormLabel>Широта</FormLabel>
          <FormControl>
            <Input
                type="number"
                step="0.0001"
                :model-value="lat"
                @update:model-value="setLat(Number($event))"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="longitude">
        <FormItem>
          <FormLabel>Довгота</FormLabel>
          <FormControl>
            <Input
                type="number"
                step="0.0001"
                :model-value="lon"
                @update:model-value="setLon(Number($event))"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>