<script setup lang="ts">
const { value: nameValue } = useField<string>('name')
const { setValue: setSlug } = useField<string>('slug')
const slugEdited = ref(false)

watch(nameValue, (val) => {
  if (!slugEdited.value) setSlug(generateSlug(val ?? ''))
})
</script>

<template>
  <div class="rounded-xl border p-6 border-zinc-200 flex flex-col gap-6">
    <div>
      <h4 class="text-xl font-semibold">Базова інформація</h4>
      <span class="text-sm text-muted-foreground">Назва та опис, які побачать гості</span>
    </div>

    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Назва</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Глемпінг «Лісова Пісня»" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="slug">
      <FormItem>
        <FormLabel>URL Slug</FormLabel>
        <FormControl>
          <div class="flex gap-2">
            <Input
                v-bind="componentField"
                placeholder="lisova-pisnya"
                class="font-mono"
                @input="slugEdited = true"
            />
          </div>
        </FormControl>
        <FormDescription>zatyshok.com/<span class="font-mono">{{ componentField.modelValue || 'your-slug' }}</span></FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Опис</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" placeholder="Опишіть атмосферу..." class="min-h-[120px]" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>