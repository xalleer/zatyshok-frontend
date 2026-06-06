export const useAuthStore = defineStore('auth', () => {

  const loading = ref(false)
  const phoneState = ref('')
  const isCodeSent = ref(false)
  const isAuthCompleted = ref(false)

  const sendOtpCode = async (phone: string) => {
    const {$api} = useNuxtApp();
    loading.value = true
    phoneState.value = phone
    try {
      await $api('/auth/send-otp', {
        method: 'POST',
        body: {phone,},
      });
      isCodeSent.value = true
    } catch (e) {
      phoneState.value = ''
      console.error('Помилка авторизації:', e);
      throw e;
    } finally {
      loading.value = false
    }
  }

  const verifyOtpCode = async (phone: string, code: string, role: string) => {
    const {$api} = useNuxtApp();
    loading.value = true
    try {
      await $api('/auth/verify-otp', {
        method: 'POST',
        body: {phone, code, role},
      });
      isAuthCompleted.value = true
    } catch (e) {
      console.error('Помилка авторизації:', e);
      throw e;
    } finally {
      loading.value = false
    }
  }

  const clearState = () => {
    phoneState.value = ''
    isCodeSent.value = false
    loading.value = false
  }

  return {
    loading,
    phoneState,
    isCodeSent,
    isAuthCompleted,
    sendOtpCode,
    verifyOtpCode,
    clearState
  }
})
