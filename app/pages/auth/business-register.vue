<script setup lang="ts">
const authStore = useAuthStore()

const onSendCode = (phone: string) => {
  authStore.sendOtpCode(phone)
}

const onVerifyCode = (code: string) => {
  authStore.verifyOtpCode(authStore.phoneState, code, 'HOST')
}

const changePhoneNumber = () => {
  authStore.clearState()
  authStore.isAuthCompleted = false
}

onUnmounted(() => {
  authStore.clearState()
})

</script>

<template>
  <AuthEnterPhone v-if="!authStore.isCodeSent && !authStore.isAuthCompleted" @send-code="onSendCode"/>
  <AuthEnterOtp v-else-if="authStore.isCodeSent && !authStore.isAuthCompleted" @verify-code="onVerifyCode" @send-code="onSendCode"/>
  <AuthCreateProperty v-else-if="authStore.isAuthCompleted" @change-phone-number="authStore.clearState()"/>

</template>
