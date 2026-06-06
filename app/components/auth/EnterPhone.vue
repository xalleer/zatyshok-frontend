<script setup lang="ts">
import {z} from 'zod'
import {toTypedSchema} from '@vee-validate/zod'

const authStore = useAuthStore()
const emit = defineEmits<{ sendCode: [phone: string] }>()

const phoneSchema = toTypedSchema(z.object({
  phone: z
    .string({message: 'Введіть номер телефону'})
    .regex(/^\+\d{8,15}$/, 'Невірний формат номеру телефону'),
  agreement: z.boolean()
    .refine(val => val === true, {message: 'Потрібно прийняти угоду'}),
}))

const form = useForm({
  validationSchema: phoneSchema,
})

const onSubmit = form.handleSubmit((values) => {
  emit('sendCode', values.phone)
})
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <!-- Заголовок сторінки -->
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">Реєстрація</h2>
      <p class="text-sm text-muted-foreground">
        Введіть номер телефону для входу або реєстрації
      </p>
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="phone">
        <FormItem>
          <FormLabel>Номер телефону</FormLabel>
          <FormControl>
            <PhoneInput v-bind="componentField"/>
          </FormControl>
          <!-- FormMessage завжди рендериться — немає стрибків верстки -->
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, value }" name="agreement">
        <FormItem>
          <FormControl>
            <div class="flex items-start gap-3">
              <Checkbox
                id="terms"
                v-bind="componentField"
                :checked="value"
                class="mt-0.5"
              />
              <Label for="terms" class="text-sm font-normal leading-relaxed cursor-pointer">
                Я погоджуюсь з
                <NuxtLink to="/terms" class="underline underline-offset-2 hover:text-foreground transition-colors">
                  угодою користувача
                </NuxtLink>
              </Label>
            </div>
          </FormControl>
          <FormMessage/>
        </FormItem>
      </FormField>

      <Button :disabled="authStore.loading" class="w-full mt-2" type="submit">
        <Spinner v-if="authStore.loading"/>
        Отримати код
      </Button>
    </form>
  </div>
</template>
