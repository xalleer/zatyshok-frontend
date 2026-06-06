import { toast } from 'vue-sonner'
import type {User, Property, VerifyOtpResponse} from "~/types";

export const useAuthStore = defineStore('auth', () => {

  const loading = ref(false)
  const phoneState = ref('')
  const isCodeSent = ref(false)
  const isAuthCompleted = ref(false)
  const user = ref<User | null>(null)
  const property = ref<Property | null>(null)



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
      const res: VerifyOtpResponse = await $api('/auth/verify-otp', {
        method: 'POST',
        body: {phone, code, role},
      });
      user.value = res.user
      if (res.property) {
        property.value = res.property
      }
      isAuthCompleted.value = true
      return property.value
    } catch (e) {
      toast.error('Невірний код')
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
    property,
    sendOtpCode,
    verifyOtpCode,
    clearState
  }
})
