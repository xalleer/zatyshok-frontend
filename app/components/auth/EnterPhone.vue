<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const authStore = useAuthStore()
const emit = defineEmits<{ sendCode: [phone: string] }>()

const phoneSchema = toTypedSchema(z.object({
  phone: z
    .string({ message: 'Введіть номер телефону' })
    .regex(/^\+\d{8,15}$/, 'Невірний номер телефону'),
  // agreement: z
  //   .boolean({ message: 'Потрібно прийняти угоди' })
}))

const form = useForm({
  validationSchema: phoneSchema,
})

const onSubmit = form.handleSubmit((values) => {
  emit('sendCode', values.phone)
})

</script>

<template>
  <form class="flex flex-col gap-2" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="phone">
      <FormItem>
        <FormLabel>Номер телефону</FormLabel>
        <FormControl>
          <PhoneInput v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField  v-slot="{ componentField }" name="agreement">
      <FormItem class="mt-4">
        <FormControl>
          <div class="flex items-start gap-2">
            <Checkbox v-bind="componentField" id="terms" />
            <Label for="terms">Я походжуюсь з угодою користувача</Label>
          </div>
        </FormControl>
        <FormMessage />

      </FormItem>
    </FormField>

    <Button :disabled="authStore.loading" class="mt-4" type="submit">
      <Spinner v-if="authStore.loading"></Spinner>
      Відправити код
    </Button>
  </form>
</template>

<style scoped>

</style>
