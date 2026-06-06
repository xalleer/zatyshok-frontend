<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type {CreatePropertyRequest} from "~/types";

const propertyStore = usePropertyStore()

const emit = defineEmits<{ changePhoneNumber: [], createProperty: [property: CreatePropertyRequest] }>()

const propertySchema = toTypedSchema(z.object({
  name: z
    .string({ message: 'Введіть назву' })
    .min(3, 'Назва повинна містити щонайменше 3 символи')
    .max(100, 'Назва занадто довга'),
}))

const form = useForm({
  validationSchema: propertySchema,
})

const onSubmit = form.handleSubmit((values) => {
  emit('createProperty', {
    name: values.name,
    slug: values.name.toLowerCase().replace(/\s+/g, '-'),
  })
})
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">Додати об'єкт</h2>
      <p class="text-sm text-muted-foreground">
        Назвіть ваш перший об'єкт оренди
      </p>
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Назва</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="Наприклад: Квартира на Майдані"
            />
          </FormControl>
          <FormDescription>
            Ця назва видима тільки вам
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button :disabled="propertyStore.loading" class="w-full" type="submit">
        <Spinner v-if="propertyStore.loading"></Spinner>
        Створити
      </Button>

      <Button
        type="button"
        class="w-full"
        variant="ghost"
        @click="emit('changePhoneNumber')"
      >
        Змінити номер телефону
      </Button>
    </form>
  </div>
</template>
