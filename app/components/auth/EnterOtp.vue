<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const authStore = useAuthStore()

const resendTimeout = ref(60)
const isResendDisabled = computed(() => resendTimeout.value > 0)

const emit = defineEmits<{ verifyCode: [code: string], sendCode: [phone: string] }>()

const resendButtonText = computed(() =>
  isResendDisabled.value ? `Надіслати ще раз через ${resendTimeout.value} с` : 'Надіслати ще раз'
)

const otpSchema = toTypedSchema(z.object({
  otp: z
    .string({ message: 'Введіть код підтвердження' })
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
  resendTimeout.value = 60
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    if (resendTimeout.value > 0) {
      resendTimeout.value--
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold tracking-tight">Підтвердження</h2>
      <p class="text-sm text-muted-foreground">
        Ми надіслали 4-значний код на
        <span class="font-medium text-foreground">{{ authStore.phoneState }}</span>
      </p>
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="otp">
        <FormItem>
          <FormLabel>Код підтвердження</FormLabel>
          <FormControl>
            <div class="flex justify-start">
              <InputOTP :maxlength="4" v-bind="componentField">
                <InputOTPGroup>
                  <InputOTPSlot :index="0" class="h-16 w-16 text-2xl" />
                </InputOTPGroup>

                <InputOTPSeparator />

                <InputOTPGroup>
                  <InputOTPSlot :index="1" class="h-16 w-16 text-2xl" />
                </InputOTPGroup>

                <InputOTPSeparator />

                <InputOTPGroup>
                  <InputOTPSlot :index="2" class="h-16 w-16 text-2xl" />
                </InputOTPGroup>

                <InputOTPSeparator />

                <InputOTPGroup>
                  <InputOTPSlot :index="3" class="h-16 w-16 text-2xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button :disabled="authStore.loading" class="w-full" type="submit">
        <Spinner v-if="authStore.loading" />
        Увійти
      </Button>

      <Button
        type="button"
        variant="ghost"
        class="w-full text-muted-foreground"
        :disabled="isResendDisabled"
        @click="sendCode"
      >
        {{ resendButtonText }}
      </Button>
    </form>
  </div>
</template>
