<script setup lang="ts">
import type {CreatePropertyRequest} from "~/types";

const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const { customBack } = useAuthLayout()

const onSendCode = async (phone: string) => {
  await authStore.sendOtpCode(phone)
}

const onVerifyCode = async (code: string) => {
  const res = await authStore.verifyOtpCode(authStore.phoneState, code, 'HOST')
  if (res) {
    await navigateTo({name: 'admin'})
  }
}

const changePhoneNumber = () => {
  authStore.clearState()
  authStore.isAuthCompleted = false
}

const onCreateProperty = async (property: CreatePropertyRequest) => {
  await propertyStore.createProperty(property)
  await navigateTo({name: 'admin'})
}

watch(
  () => authStore.isCodeSent,
  (isCodeSent) => {
    if (isCodeSent) {
      customBack.value = () => {
        authStore.clearState()
      }
    } else {
      customBack.value = null
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  authStore.clearState()
  customBack.value = null
})
</script>

<template>
  <AuthEnterPhone
    v-if="!authStore.isCodeSent && !authStore.isAuthCompleted"
    @send-code="onSendCode"
  />
  <AuthEnterOtp
    v-else-if="authStore.isCodeSent && !authStore.isAuthCompleted"
    @verify-code="onVerifyCode"
    @send-code="onSendCode"
  />
  <AuthCreateProperty
    v-else-if="authStore.isAuthCompleted && !authStore.property"
    @create-property="onCreateProperty"
    @change-phone-number="changePhoneNumber"
  />
</template>
