<script setup lang="ts">
import {z} from 'zod'
import {toTypedSchema} from '@vee-validate/zod'

const authStore = useAuthStore()

const resendTimeout = ref(60)
const isResendDisabled = computed(() => resendTimeout.value > 0)

const emit = defineEmits<{ verifyCode: [code: string], sendCode: [phone: string] }>()

const resetButtonText = computed(() => {
  if (isResendDisabled.value) {
    return `${resendTimeout.value} секунд`}
  return 'Надіслати ще раз'
})

const otpSchema = toTypedSchema(z.object({
  otp: z
    .string({message: 'Введіть код підтвердження'})
    .length(4, 'Код повинен складатися з 4 цифр'),
}))

const form = useForm({
  validationSchema: otpSchema,
})

const onSubmit = form.handleSubmit((values) => {
  emit('verifyCode', values.otp)
})

const sendCode = () => {
  emit('sendCode', authStore.phoneState)
}

onMounted(() => {
  setInterval(() => {
    if (resendTimeout.value > 0) {
      resendTimeout.value--
    }
  }, 1000)
})
</script>

<template>
  <form @submit="onSubmit" class="flex flex-col gap-2">
    <FormField v-slot="{ componentField }" name="otp">
      <FormItem>
        <FormLabel>Код надіслано на {{ authStore.phoneState }}</FormLabel>
        <FormControl>
          <InputOTP :maxlength="4" v-bind="componentField">
            <InputOTPGroup>
              <InputOTPSlot :index="0"></InputOTPSlot>
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot :index="1"></InputOTPSlot>
            </InputOTPGroup>
            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot :index="2"></InputOTPSlot>
            </InputOTPGroup>
            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot :index="3"></InputOTPSlot>
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
        <FormMessage/>
      </FormItem>
    </FormField>

    <Button :disabled="authStore.loading" class="mt-4" type="submit">
      <Spinner v-if="authStore.loading"></Spinner>
      Увійти
    </Button>

    <Button @click="sendCode" :disabled="isResendDisabled" variant="ghost">
      {{ resetButtonText }}
    </Button>


  </form>
</template>

<style scoped>

</style>
