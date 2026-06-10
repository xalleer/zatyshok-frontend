<script setup lang="ts">
import type {CreatePropertyRequest} from "~/types";

const authStore = useAuthStore()
const propertyStore = usePropertyStore()

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



onUnmounted(() => {
  authStore.clearState()
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
